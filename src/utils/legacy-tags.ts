/**
 * Tags renamed when they became language-neutral kebab-case identifiers
 * (#256). Their old pages were indexed, so the tag routes answer them with a
 * 301 to the new name. Old spelling → current tag.
 */
export const LEGACY_TAGS: Readonly<Record<string, string>> = {
  ASPECCT: "aspecct",
  Astro: "astro",
  Components: "components",
  "Functional UI": "functional-ui",
  "Hindley-Milner": "hindley-milner",
  IIFE: "iife",
  Inmutable: "immutable",
  JSX: "jsx",
  "Pure functions": "pure-functions",
  automatización: "automation",
  "buenas-prácticas": "best-practices",
  desarrollo: "development",
  "desarrollo-web": "web-development",
  "design patterns": "design-patterns",
  "functional mixins": "functional-mixins",
  gobernanza: "governance",
  herramientas: "tools",
  inherence: "inheritance",
  "inteligencia-artificial": "artificial-intelligence",
  internacionalización: "internationalization",
  "mejores-practicas": "best-practices",
  "method chaining": "method-chaining",
  "micro-branching strategies": "micro-branching",
  "object properties": "object-properties",
  "particle system": "particle-system",
  reglas: "rules",
  "statement branching": "statement-branching",
  "statement brnaching": "statement-branching",
  taxonomía: "taxonomy",
};
