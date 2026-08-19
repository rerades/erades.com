import astro from "eslint-plugin-astro";
import tsParser from "@typescript-eslint/parser";

// Limites de arquitectura, documentados en "Architecture" de CLAUDE.md.
// Los imports del repo son relativos (no usan los alias `~` / `@components`),
// asi que los patrones casan segmentos de ruta.
//
// ESLint flat config NO fusiona la config de una misma regla entre bloques: el
// ultimo que casa gana. Por eso cada capa repite los patrones de la anterior en
// vez de anadir solo el suyo.
const NO_PAGES = {
  group: ["**/pages/**"],
  message:
    "Las rutas son hojas: solo Astro las invoca. Si necesitas esto, extraelo a utils/ o components/.",
};
const NO_LAYOUTS = {
  group: ["**/layouts/**"],
  message: "Solo pages/ importa layouts/. Un componente que llama a un layout es un ciclo de render.",
};
const NO_COMPONENTS = {
  group: ["**/components/**"],
  message: "utils/ e i18n/ son la capa base y no dependen de UI.",
};

const restrict = (patterns) => ["error", { patterns }];

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Astro files. `astro.configs.recommended` ya es una lista de configs flat
  // (trae su propio parser y sus `files`), asi que se expande tal cual. Leerle
  // un `.rules` deja el plugin cargado pero sin ninguna regla activa.
  ...astro.configs.recommended,
  {
    files: ["src/**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
  },
  // TypeScript files
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: "module",
    },
    rules: {},
  },

  // Capas, de la regla mas general a la mas restrictiva.
  {
    files: ["src/**/*.{ts,tsx,astro}"],
    rules: { "no-restricted-imports": restrict([NO_PAGES]) },
  },
  {
    files: ["src/components/**/*.{ts,tsx,astro}"],
    rules: { "no-restricted-imports": restrict([NO_PAGES, NO_LAYOUTS]) },
  },
  {
    files: ["src/utils/**/*.ts", "src/i18n/**/*.ts"],
    rules: {
      "no-restricted-imports": restrict([NO_PAGES, NO_LAYOUTS, NO_COMPONENTS]),
    },
  },
];
