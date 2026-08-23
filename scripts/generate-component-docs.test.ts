import { describe, expect, it } from "vitest";

import {
  findMissing,
  parseDocBlock,
  readBarrel,
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
