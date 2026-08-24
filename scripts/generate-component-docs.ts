// Genera docs/components/ a partir de los propios componentes: el JSDoc de su
// cabecera (@title, @description, @usage…, el formato de bejamas/ui) más la
// tabla de props y los slots, que se leen del `interface Props` y del markup.
//
// La mitad interesante es esa: la API no se redacta, se extrae. Una prop nueva
// aparece en la doc sola, y una que se renombre no deja atrás una tabla que
// miente. Lo único que se escribe a mano es lo que ningún parser puede
// deducir: para qué sirve el componente y cómo se usa.
//
// Dos orígenes:
//   - src/components/ui/*/    primitivos copiados del registry de bejamas/ui.
//     Traen el JSDoc puesto y un index.ts que dice qué exporta la copia local.
//   - src/components/*.astro  componentes del sitio. El JSDoc se escribe aquí.
//
// No se usa `bejamas docs:build` por lo mismo que no se usa `bejamas add` (ver
// docs/bejamas-ui.md): emite MDX para Starlight, que aquí no hay.

import { promises as fs } from "fs";
import path from "path";

const COMPONENTS_DIR = path.join(process.cwd(), "src/components");
const UI_DIR = path.join(COMPONENTS_DIR, "ui");
const OUT_DIR = path.join(process.cwd(), "docs/components");

// Solo estos. El JSDoc lleva dentro bloques de código con `@lucide/astro` y
// `@data-slot/core` a principio de línea, y no son secciones.
const TAGS = [
  "component",
  "title",
  "description",
  "status",
  "figmaUrl",
  "preview",
  "usage",
  "api",
  "examples",
] as const;

type Tag = (typeof TAGS)[number];
type DocBlock = Partial<Record<Tag, string>>;

interface Barrel {
  /** El comentario de cabecera de index.ts: qué se descartó del registry y por qué. */
  readonly note: string;
  readonly exports: readonly { readonly name: string; readonly file: string }[];
}

interface PropRow {
  readonly name: string;
  readonly type: string;
  readonly required: boolean;
  readonly doc: string;
}

interface ComponentDoc {
  /** Nombre del fichero de doc y de la ruta: `blog-card`, `separator`. */
  readonly id: string;
  readonly kind: "primitivo" | "sitio";
  readonly sourcePath: string;
  readonly importPath: string;
  readonly doc: DocBlock;
  readonly barrel: Barrel | null;
  readonly props: readonly PropRow[];
  readonly propsExtends: string | null;
  readonly slots: readonly string[];
}

/**
 * Extrae el primer bloque `/** … *\/` y lo parte por los tags conocidos.
 * Sin bloque devuelve `{}`.
 */
export function parseDocBlock(source: string): DocBlock {
  const block = source.match(/\/\*\*\r?\n([\s\S]*?)\*\//);
  if (!block?.[1]) return {};

  const body = block[1]
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*\* ?/, ""))
    .join("\n");

  const doc: DocBlock = {};
  const matcher = new RegExp(`^@(${TAGS.join("|")})\\b[ \\t]*`, "gm");
  const hits = [...body.matchAll(matcher)];

  hits.forEach((hit, i) => {
    const tag = hit[1] as Tag;
    const start = hit.index + hit[0].length;
    const end = hits[i + 1]?.index ?? body.length;
    doc[tag] = body.slice(start, end).trim();
  });

  return doc;
}

/**
 * Lee el `interface Props`. Es un parser de texto, no un compilador:
 * reconoce una prop por línea, con su `/** … *\/` opcional encima.
 *
 * ponytail: no entiende tipos multilínea ni props heredadas de un `extends`;
 * hoy no hay ninguno. Si aparecen, lo que toca es tirar del compilador de
 * TypeScript (`ts.createSourceFile`), no engordar la regex.
 */
export function parseProps(source: string): {
  rows: readonly PropRow[];
  extendsClause: string | null;
} {
  const header = source.match(/interface Props(?:\s+extends\s+([^{]+?))?\s*\{/);
  if (!header) return { rows: [], extendsClause: null };

  const body = source
    .slice(header.index! + header[0].length)
    .split(/\n\}/)[0] as string;

  const rows: PropRow[] = [];
  let doc = "";

  for (const line of body.split(/\r?\n/)) {
    const comment = line.match(/^\s*\/\*\*\s*(.*?)\s*\*\/\s*$/);
    if (comment) {
      doc = comment[1] as string;
      continue;
    }

    const prop = line.match(
      /^\s*(?:readonly\s+)?([\w$]+)(\?)?:\s*(.+?);?\s*$/
    );
    if (!prop) continue;

    rows.push({
      name: prop[1] as string,
      type: (prop[3] as string).trim(),
      required: prop[2] === undefined,
      doc,
    });
    doc = "";
  }

  return { rows, extendsClause: header[1]?.trim() ?? null };
}

export function parseSlots(source: string): readonly string[] {
  const slots = [...source.matchAll(/<slot(?:\s+name="([^"]+)")?/g)].map(
    (m) => m[1] ?? "default"
  );
  return [...new Set(slots)];
}

/**
 * Corrige lo que el JSDoc del registry dice del paquete upstream: el import
 * apunta al barrel local y `nocollapse` (sintaxis del sitio de bejamas) sobra
 * en un fence que va a renderizar GitHub.
 */
export function rewriteUpstream(text: string): string {
  return text
    .replace(/@bejamas\/ui\/components\//g, "./ui/")
    .replace(/^(```[a-z]+) nocollapse\s*$/gm, "$1");
}

export function readBarrel(indexSource: string): Barrel {
  const note = indexSource
    .split(/\r?\n/)
    .filter((line) => line.startsWith("//"))
    // La primera línea del registry ("Generated from … Do not edit") no dice
    // nada al lector de la doc; lo que importa es la nota de la copia local.
    .filter((line) => !line.includes("Generated from"))
    .map((line) => line.replace(/^\/\/ ?/, ""))
    .join("\n")
    .trim();

  const exports = [
    ...indexSource.matchAll(
      /export \{ default as (\w+) \} from "\.\/([\w.]+)"/g
    ),
  ].map((m) => ({ name: m[1] as string, file: m[2] as string }));

  return { note, exports };
}

/**
 * Componentes que los ejemplos del registry usan pero el barrel local no
 * exporta. Pasa de verdad: `@usage` de dropdown-menu importa
 * `DropdownMenuTrigger`, que aquí se descartó. Sin este aviso la doc generada
 * enseña a escribir un import que no compila.
 */
export function findMissing(
  body: string,
  barrel: Barrel,
  component: string
): readonly string[] {
  const used = [...body.matchAll(/<([A-Z]\w+)/g)].map((m) => m[1] as string);
  const available = new Set(barrel.exports.map((e) => e.name));

  return [...new Set(used)]
    .filter((name) => name.startsWith(component) && !available.has(name))
    .sort();
}

export const kebabCase = (name: string): string =>
  name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

/**
 * Una celda de tabla Markdown no admite saltos de línea (cierran la fila)
 * ni `|` crudo (parte la columna: un tipo `"es" | "en"` se volvería tres).
 */
export function markdownTableCell(text: string): string {
  return text.replace(/\s+/g, " ").trim().replace(/\|/g, "\\|");
}

function renderProps(component: ComponentDoc): readonly string[] {
  const { props, propsExtends } = component;
  if (props.length === 0 && propsExtends === null) return [];

  const out = ["## Props", ""];
  if (propsExtends) {
    out.push(`Extiende \`${propsExtends}\`.`, "");
  }
  if (props.length === 0) return [...out];

  out.push(
    "| Prop | Tipo | Obligatoria | Descripción |",
    "| --- | --- | --- | --- |",
    ...props.map(
      (p) =>
        `| \`${p.name}\` | \`${markdownTableCell(p.type)}\` | ${p.required ? "sí" : "—"} | ${markdownTableCell(p.doc)} |`
    ),
    ""
  );
  return out;
}

export function renderMarkdown(component: ComponentDoc): string {
  const { id, doc, barrel, slots, sourcePath, importPath } = component;

  const out: string[] = [
    `# ${doc.title ?? doc.component ?? id}`,
    "",
    `> Generado por \`pnpm docs:components\` desde [\`${path.basename(sourcePath)}\`](../../${sourcePath}). No editar a mano.`,
    "",
  ];

  if (doc.description) out.push(doc.description, "");

  const meta = [
    doc.status ? `Estado: **${doc.status}**` : null,
    doc.figmaUrl ? `[Figma](${doc.figmaUrl})` : null,
  ].filter(Boolean);
  if (meta.length > 0) out.push(meta.join(" · "), "");

  out.push("## Importar", "");
  if (barrel) {
    if (barrel.note) {
      // Las notas mencionan etiquetas (`<button>`) que Markdown renderizaría
      // como HTML: en una cita desaparecen.
      const note = barrel.note.replace(/</g, "&lt;").replace(/\n/g, "\n> ");
      out.push(`> ${note}`, "");
    }
    out.push(
      "```astro",
      `import { ${barrel.exports.map((e) => e.name).join(", ")} } from "${importPath}";`,
      "```",
      ""
    );
  } else {
    out.push(
      "```astro",
      `import ${doc.component ?? id} from "${importPath}";`,
      "```",
      ""
    );
  }
  out.push(
    "Ruta relativa desde `src/components/`, que es como se importa aquí.",
    ""
  );

  out.push(...renderProps(component));

  if (slots.length > 0) {
    out.push(
      "## Slots",
      "",
      ...slots.map((s) => `- \`${s}\``),
      "",
      "Detectados en el markup; los slots con nombre se comprueban con `Astro.slots.has()`.",
      ""
    );
  }

  if (barrel) {
    const body = [doc.preview, doc.usage, doc.api, doc.examples]
      .filter(Boolean)
      .join("\n");
    const missing = findMissing(body, barrel, doc.component ?? "");
    if (missing.length > 0) {
      out.push(
        `> **Ojo:** los ejemplos de abajo vienen del registry y usan ${missing
          .map((n) => `\`${n}\``)
          .join(", ")}, que esta copia no exporta (el motivo, arriba). Adáptalos.`,
        ""
      );
    }
  }

  // @preview es markup suelto, no Markdown: sin fence GitHub se lo come.
  if (doc.preview) {
    out.push("## Preview", "", "```astro", doc.preview, "```", "");
  }
  // El resto ya viene en Markdown válido — tablas incluidas — y pasa verbatim.
  if (doc.usage) out.push("## Uso", "", doc.usage, "");
  if (doc.api) out.push("## API", "", doc.api, "");
  if (doc.examples) out.push("## Ejemplos", "", doc.examples, "");

  return rewriteUpstream(out.join("\n").replace(/\n{3,}/g, "\n\n"));
}

export function renderIndex(docs: readonly ComponentDoc[]): string {
  const table = (kind: ComponentDoc["kind"]): readonly string[] => {
    const rows = docs
      .filter((d) => d.kind === kind)
      .map(
        (d) =>
          `| [${d.doc.title ?? d.id}](./${d.id}.md) | ${markdownTableCell(d.doc.description ?? "")} | ${d.props.length} |`
      );
    return ["| Componente | Descripción | Props |", "| --- | --- | --- |", ...rows];
  };

  return [
    "# Componentes",
    "",
    "> Generado por `pnpm docs:components`. No editar a mano.",
    "",
    "La descripción y el uso salen del JSDoc de cada componente; la tabla de",
    "props y los slots se leen del `interface Props` y del markup, así que no",
    "envejecen. Verlos en marcha: `pnpm dev` y `/es/dev/componentes`.",
    "",
    "## Primitivos (`ui/`)",
    "",
    "Copiados del registry de bejamas/ui. Son los únicos con JS de cliente. El",
    "*cómo* se copian y se podan está en [`../bejamas-ui.md`](../bejamas-ui.md);",
    "su coste medido, en [`../bejamas-ui-presupuesto.md`](../bejamas-ui-presupuesto.md).",
    "",
    ...table("primitivo"),
    "",
    "## Componentes del sitio",
    "",
    ...table("sitio"),
    "",
  ].join("\n");
}

async function collectPrimitive(dir: string): Promise<ComponentDoc | null> {
  const entries = await fs.readdir(path.join(UI_DIR, dir));

  for (const file of entries.filter((f) => f.endsWith(".astro"))) {
    const source = await fs.readFile(path.join(UI_DIR, dir, file), "utf-8");
    const doc = parseDocBlock(source);
    // El componente raíz es el que lleva el JSDoc; los subcomponentes no.
    if (!doc.component) continue;

    const index = await fs.readFile(path.join(UI_DIR, dir, "index.ts"), "utf-8");
    const { rows, extendsClause } = parseProps(source);

    return {
      id: dir,
      kind: "primitivo",
      sourcePath: `src/components/ui/${dir}/${file}`,
      importPath: `./ui/${dir}`,
      doc,
      barrel: readBarrel(index),
      props: rows,
      propsExtends: extendsClause,
      slots: parseSlots(source),
    };
  }

  return null;
}

async function collectSiteComponent(file: string): Promise<ComponentDoc | null> {
  const source = await fs.readFile(path.join(COMPONENTS_DIR, file), "utf-8");
  const doc = parseDocBlock(source);
  if (!doc.component) return null;

  const { rows, extendsClause } = parseProps(source);

  return {
    id: kebabCase(path.basename(file, ".astro")),
    kind: "sitio",
    sourcePath: `src/components/${file}`,
    importPath: `./${file}`,
    doc,
    barrel: null,
    props: rows,
    propsExtends: extendsClause,
    slots: parseSlots(source),
  };
}

async function main(): Promise<void> {
  const uiDirs = (await fs.readdir(UI_DIR, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const siteFiles = (await fs.readdir(COMPONENTS_DIR))
    .filter((f) => f.endsWith(".astro"))
    .sort();

  const collected = [
    ...(await Promise.all(uiDirs.map(collectPrimitive))),
    ...(await Promise.all(siteFiles.map(collectSiteComponent))),
  ];
  const docs = collected.filter((d): d is ComponentDoc => d !== null);

  await fs.mkdir(OUT_DIR, { recursive: true });

  for (const doc of docs) {
    const out = path.join(OUT_DIR, `${doc.id}.md`);
    await fs.writeFile(out, renderMarkdown(doc), "utf-8");
  }

  const index = path.join(OUT_DIR, "README.md");
  await fs.writeFile(index, renderIndex(docs), "utf-8");

  // Borrar un componente tiene que borrar su doc. Sin esto, el fichero se
  // queda documentando algo que ya no existe y nadie lo nota, que es
  // exactamente lo que la doc generada venía a evitar.
  const vigentes = new Set([...docs.map((d) => `${d.id}.md`), "README.md"]);
  const huerfanas = (await fs.readdir(OUT_DIR)).filter(
    (f) => f.endsWith(".md") && !vigentes.has(f)
  );

  for (const file of huerfanas) {
    await fs.rm(path.join(OUT_DIR, file));
    process.stdout.write(`huérfana borrada: ${file}\n`);
  }

  const undocumented = siteFiles.length + uiDirs.length - docs.length;
  process.stdout.write(
    `${docs.length} componente(s) en docs/components/` +
      (undocumented > 0 ? `, ${undocumented} sin @component\n` : "\n")
  );
}

// Solo al ejecutarlo; el test importa los helpers de arriba.
if (process.argv[1]?.endsWith("generate-component-docs.ts")) {
  main().catch((err) => {
    process.stderr.write(`[docs:components] ${String(err)}\n`);
    process.exitCode = 1;
  });
}
