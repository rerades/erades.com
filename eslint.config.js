import astro from "eslint-plugin-astro";
import tsParser from "@typescript-eslint/parser";

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
];
