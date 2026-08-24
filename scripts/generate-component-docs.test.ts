import { describe, expect, it } from "vitest";

import {
  findMissing,
  kebabCase,
  markdownTableCell,
  parseDocBlock,
  parseProps,
  parseSlots,
  readBarrel,
  renderIndex,
  rewriteUpstream,
} from "./generate-component-docs";

const FIXTURE = `// Generated from bejamas-juno style registry.
/**
 * @component Widget
 * @title Widget
 * @description Hace cosas.
 *
 * @usage
 *
 * \`\`\`astro nocollapse
 * ---
 * import { Widget } from '@bejamas/ui/components/widget';
 * import Icon from '@lucide/astro/Cog';
 * ---
 * \`\`\`
 *
 * @examples
 *
 * ### Variantes
 */
---
const { class: className } = Astro.props;
---
`;

describe("parseDocBlock", () => {
  const doc = parseDocBlock(FIXTURE);

  it("separa cada tag en su sección", () => {
    expect(doc.component).toBe("Widget");
    expect(doc.description).toBe("Hace cosas.");
    expect(doc.examples).toBe("### Variantes");
  });

  it("no parte por los @ que son nombres de paquete dentro del código", () => {
    // `@lucide/astro` abre línea dentro del fence de @usage: si se tratara
    // como tag, @usage se cortaría a la mitad y @examples se perdería.
    expect(doc.usage).toContain("@lucide/astro/Cog");
    expect(doc.usage).toContain("```");
  });

  it("devuelve {} cuando no hay bloque", () => {
    expect(parseDocBlock("---\nconst x = 1;\n---")).toEqual({});
  });

  it("conserva los párrafos extra de @description", () => {
    const source = [
      "/**",
      " * @description Primera línea.",
      " *",
      " * Segunda con a | b.",
      " * @usage x",
      " */",
    ].join("\n");
    expect(parseDocBlock(source).description).toBe(
      "Primera línea.\n\nSegunda con a | b."
    );
  });
});

describe("rewriteUpstream", () => {
  it("apunta el import al barrel local y quita nocollapse", () => {
    const out = rewriteUpstream(parseDocBlock(FIXTURE).usage ?? "");
    expect(out).toContain(`'./ui/widget'`);
    expect(out).not.toContain("@bejamas/ui");
    expect(out).toContain("```astro\n");
    expect(out).not.toContain("nocollapse");
  });
});

describe("readBarrel", () => {
  const barrel = readBarrel(
    [
      "// Generated from bejamas-juno style registry. Do not edit.",
      "// Descartado WidgetTrigger: arrastra class-variance-authority.",
      'export { default as Widget } from "./Widget.astro";',
      'export { default as WidgetItem } from "./WidgetItem.astro";',
    ].join("\n")
  );

  it("lista solo lo que el barrel exporta de verdad", () => {
    expect(barrel.exports.map((e) => e.name)).toEqual(["Widget", "WidgetItem"]);
  });

  it("conserva la nota de la copia local y descarta la del registry", () => {
    expect(barrel.note).toBe(
      "Descartado WidgetTrigger: arrastra class-variance-authority."
    );
  });
});

describe("findMissing", () => {
  const barrel = readBarrel(
    'export { default as Widget } from "./Widget.astro";'
  );

  it("avisa de lo que los ejemplos usan y el barrel no exporta", () => {
    const body = "<Widget>\n  <WidgetTrigger>x</WidgetTrigger>\n</Widget>";
    expect(findMissing(body, barrel, "Widget")).toEqual(["WidgetTrigger"]);
  });

  it("ignora componentes ajenos al primitivo", () => {
    expect(findMissing("<Button>x</Button>", barrel, "Widget")).toEqual([]);
  });
});

describe("parseProps", () => {
  const { rows, extendsClause } = parseProps(`
interface Props extends HTMLAttributes<"div"> {
  /** Página actual (1-indexed) */
  currentPage: number;
  getPageHref?: (page: number) => string;
  readonly class?: string;
  lang?: "es" | "en";
}
`);

  it("lee nombre, tipo, obligatoriedad y el /** */ de encima", () => {
    expect(rows[0]).toEqual({
      name: "currentPage",
      type: "number",
      required: true,
      doc: "Página actual (1-indexed)",
    });
  });

  it("no se traga la flecha de un tipo función como fin de línea", () => {
    expect(rows[1]).toMatchObject({
      name: "getPageHref",
      type: "(page: number) => string",
      required: false,
    });
  });

  it("quita el readonly y conserva el extends", () => {
    expect(rows[2]?.name).toBe("class");
    expect(extendsClause).toBe('HTMLAttributes<"div">');
  });

  it("no inventa props cuando no hay interface", () => {
    expect(parseProps("const { x } = Astro.props;").rows).toEqual([]);
  });
});

describe("parseSlots", () => {
  it("distingue el slot por defecto de los que tienen nombre", () => {
    expect(parseSlots('<slot name="then" /><slot /><slot name="then" />')).toEqual(
      ["then", "default"]
    );
  });
});

describe("kebabCase", () => {
  it("convierte el nombre del componente en el de su doc", () => {
    expect(kebabCase("BlogCardGrid")).toBe("blog-card-grid");
    expect(kebabCase("If")).toBe("if");
  });
});

describe("markdownTableCell", () => {
  it("aplana saltos de línea y escapa tuberías", () => {
    expect(markdownTableCell("Primera.\n\nSegunda con a | b.")).toBe(
      "Primera. Segunda con a \\| b."
    );
  });
});

describe("renderIndex", () => {
  it("mete la descripción multilínea en una sola fila", () => {
    const index = renderIndex([
      {
        id: "blog-filters",
        kind: "sitio",
        sourcePath: "src/components/BlogFilters.astro",
        importPath: "./BlogFilters.astro",
        doc: {
          title: "Blog Filters",
          description: "Filtro GET.\n\nEl orden usa NativeSelect.",
        },
        barrel: null,
        props: [
          { name: "lang", type: '"es" | "en"', required: true, doc: "" },
        ],
        propsExtends: null,
        slots: [],
      },
    ]);

    const row = index
      .split("\n")
      .find((line) => line.includes("./blog-filters.md"));

    expect(row).toBe(
      "| [Blog Filters](./blog-filters.md) | Filtro GET. El orden usa NativeSelect. | 1 |"
    );
  });
});
