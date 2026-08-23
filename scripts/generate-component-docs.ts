// Saca a docs/components/ el JSDoc que los componentes de src/components/ui
// ya traen del registry de bejamas/ui (@title, @preview, @usage, @api,
// @examples). No se escribe documentación: se extrae la que lleva meses
// enterrada en la cabecera de un .astro que nadie abre.
//
// No se usa `bejamas docs:build` por lo mismo que no se usa `bejamas add` (ver
// docs/bejamas-ui.md): emite MDX para Starlight, que aquí no hay.
//
// El JSDoc describe el paquete upstream, no esta copia. De ahí las dos
// correcciones que hace este script: reescribe los imports a la ruta real y
// lista los exports leídos de index.ts, que es lo único que dice la verdad
// sobre lo que la copia local ofrece. Ver `rewriteUpstream` y `readBarrel`.

import { promises as fs } from "fs";
import path from "path";

const UI_DIR = path.join(process.cwd(), "src/components/ui");
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

interface ComponentDoc {
  readonly dir: string;
  readonly source: string;
  readonly doc: DocBlock;
  readonly barrel: Barrel;
}

/**
 * Extrae el primer bloque `/** … *\/` y lo parte por los tags conocidos.
 * Sin bloque devuelve `{}`: los subcomponentes no lo llevan.
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
 * Corrige lo que el JSDoc dice del paquete upstream: el import apunta al
 * barrel local y `nocollapse` (sintaxis del sitio de bejamas) sobra en un
 * fence que va a renderizar GitHub.
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

export function renderMarkdown({
  dir,
  source,
  doc,
  barrel,
}: ComponentDoc): string {
  const rel = `src/components/ui/${dir}/${source}`;
  const out: string[] = [
    `# ${doc.title ?? doc.component ?? dir}`,
    "",
    `> Generado por \`pnpm docs:components\` desde el JSDoc de [\`${source}\`](../../${rel}). No editar a mano: los cambios se pierden en la siguiente copia del registry.`,
    "",
  ];

  if (doc.description) out.push(doc.description, "");

  const meta = [
    doc.status ? `Estado: **${doc.status}**` : null,
    doc.figmaUrl ? `[Figma](${doc.figmaUrl})` : null,
  ].filter(Boolean);
  if (meta.length > 0) out.push(meta.join(" · "), "");

  out.push("## Exports en este repo", "");
  if (barrel.note) {
    // Las notas mencionan etiquetas (`<button>`) que Markdown renderizaría
    // como HTML: en una cita desaparecen.
    const note = barrel.note.replace(/</g, "&lt;").replace(/\n/g, "\n> ");
    out.push(`> ${note}`, "");
  }
  out.push(
    ...barrel.exports.map((e) => `- \`${e.name}\` — \`${e.file}\``),
    "",
    "```astro",
    `import { ${barrel.exports.map((e) => e.name).join(", ")} } from "./ui/${dir}";`,
    "```",
    "",
    `Ruta relativa desde \`src/components/\`, que es como se importan aquí (ver \`BlogFilters.astro\`, \`Header.astro\`).`,
    ""
  );

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
  const rows = docs.map(
    ({ dir, doc, barrel }) =>
      `| [${doc.title ?? dir}](./${dir}.md) | ${doc.description ?? ""} | ${barrel.exports.length} |`
  );

  return [
    "# Componentes de `src/components/ui`",
    "",
    "> Generado por `pnpm docs:components`. No editar a mano.",
    "",
    "Primitivos copiados del registry de bejamas/ui. Son los únicos componentes",
    "del repo con JS de cliente, y por eso los únicos que tienen una API que",
    "merezca documentarse. El *cómo* se copian y se podan está en",
    "[`../bejamas-ui.md`](../bejamas-ui.md); su coste medido, en",
    "[`../bejamas-ui-presupuesto.md`](../bejamas-ui-presupuesto.md).",
    "",
    "| Componente | Descripción | Exports |",
    "| --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}

async function collect(dir: string): Promise<ComponentDoc | null> {
  const entries = await fs.readdir(path.join(UI_DIR, dir));
  // El componente raíz es el que lleva el JSDoc; los subcomponentes no.
  const astroFiles = entries.filter((f) => f.endsWith(".astro"));

  for (const source of astroFiles) {
    const content = await fs.readFile(path.join(UI_DIR, dir, source), "utf-8");
    const doc = parseDocBlock(content);
    if (!doc.component) continue;

    const index = await fs.readFile(path.join(UI_DIR, dir, "index.ts"), "utf-8");
    return { dir, source, doc, barrel: readBarrel(index) };
  }

  return null;
}

async function main(): Promise<void> {
  const dirs = (await fs.readdir(UI_DIR, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const docs = (await Promise.all(dirs.map(collect))).filter(
    (d): d is ComponentDoc => d !== null
  );

  await fs.mkdir(OUT_DIR, { recursive: true });

  for (const doc of docs) {
    const out = path.join(OUT_DIR, `${doc.dir}.md`);
    await fs.writeFile(out, renderMarkdown(doc), "utf-8");
    process.stdout.write(`${path.relative(process.cwd(), out)}\n`);
  }

  const index = path.join(OUT_DIR, "README.md");
  await fs.writeFile(index, renderIndex(docs), "utf-8");
  process.stdout.write(`${path.relative(process.cwd(), index)}\n`);

  const skipped = dirs.length - docs.length;
  if (skipped > 0) {
    process.stdout.write(`(${skipped} carpeta(s) sin @component, saltadas)\n`);
  }
}

// Solo al ejecutarlo; el test importa los helpers de arriba.
if (process.argv[1]?.endsWith("generate-component-docs.ts")) {
  main().catch((err) => {
    process.stderr.write(`[docs:components] ${String(err)}\n`);
    process.exitCode = 1;
  });
}
