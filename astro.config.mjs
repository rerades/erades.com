// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import astroExpressiveCode from "astro-expressive-code";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
// https://astro.build/config
// Predefine Vite config with JSDoc typing to avoid excess property checks
/** @type {import('vite').UserConfig} */
const viteConfig = {
  resolve: {
    alias: {
      "@components": fileURLToPath(
        new URL("./src/components", import.meta.url)
      ),
      "~": fileURLToPath(new URL("./src", import.meta.url)),
      // Los componentes de bejamas/ui vienen escritos contra `@/`.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    tailwindcss(),
    {
      name: "exclude-public-test-files",
      /** @param {any} _ @param {any} bundle */
      generateBundle(_, bundle) {
        for (const file in bundle) {
          if (file.startsWith("public/") && file.endsWith(".test.js")) {
            delete bundle[file];
          }
        }
      },
      apply: "build",
    },
  ],
};

export default defineConfig({
  i18n: {
    defaultLocale: "en",
    locales: ["es", "en"],
    routing: {
      // Todas las páginas viven bajo `src/pages/[lang]/`, así que ambos idiomas
      // van prefijados (/es/... y /en/...). Con `false`, Astro 7 trata /en como
      // ruta inválida y devuelve 404. La redirección de `/` la hace
      // `src/pages/index.astro`.
      prefixDefaultLocale: true,
    },
  },
  site: "https://erades.com",
  // Cada idioma tiene su propio slug desde que se tradujeron las rutas. Estas
  // son las URLs antiguas, que ya estaban indexadas y enlazadas desde fuera.
  redirects: {
    "/es/blog/ai-take-aways/aspecct-metodologia-prompting": "/es/blog/ia/aspecct-metodologia-prompting",
    "/es/blog/ai-take-aways/i18n": "/es/blog/ia/i18n",
    "/es/blog/ai-take-aways/por-que-fallan-las-fabricas-de-software": "/es/blog/ia/por-que-fallan-las-fabricas-de-software",
    "/es/blog/css-load": "/es/blog/estrategias-de-carga-css",
    "/es/blog/experiments/particle-system-01": "/es/blog/experimentos/sistema-de-particulas-01",
    "/es/blog/functional/combinators": "/es/blog/funcional/combinadores",
    "/es/blog/functional/functional-programming": "/es/blog/funcional/programacion-funcional",
    "/es/blog/functional/functors": "/es/blog/funcional/funtores",
    "/es/blog/functional/Hindley-Milner-notation": "/es/blog/funcional/notacion-hindley-milner",
    "/es/blog/functional/memoize": "/es/blog/funcional/memoizar",
    "/es/blog/functional/transducers": "/es/blog/funcional/transductores",
    "/es/blog/global-variables-are-bad": "/es/blog/las-variables-globales-son-malas",
    "/es/blog/lexical-and-dynamic-scope": "/es/blog/ambito-lexico-y-dinamico",
    "/es/blog/method-chaining-in-javascript": "/es/blog/encadenamiento-de-metodos-en-javascript",
    "/es/blog/object-atribute-properties": "/es/blog/propiedades-de-atributos-de-objetos",
    "/es/blog/patterns/conditional-rendering-with-show.astro": "/es/blog/patrones/renderizado-condicional-explicito",
    "/es/blog/patterns/iife": "/es/blog/patrones/iife",
    "/es/blog/patterns/mixins": "/es/blog/patrones/mixins",
    "/es/blog/patterns/testing-protoype-inheritance": "/es/blog/patrones/probando-la-herencia-de-prototipos",
    "/es/blog/statement-branching-vs-micro-branching": "/es/blog/ramificacion-por-sentencias-vs-micro-ramificacion",
    "/en/blog/ai-take-aways/aspecct-metodologia-prompting": "/en/blog/ai-take-aways/aspecct-prompting-methodology",
    "/en/blog/ai-take-aways/por-que-fallan-las-fabricas-de-software": "/en/blog/ai-take-aways/why-software-factories-fail",
  },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  markdown: {
    shikiConfig: {
      theme: "dracula",
    },
  },
  integrations: [
    astroExpressiveCode({
      themes: ["dracula"],
    }),
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          es: "es-ES",
          en: "en-US",
        },
      },
      filter: (page) => {
        // Excluir páginas de prueba y desarrollo
        // /dev/componentes solo responde en `pnpm dev` (404 en producción),
        // pero mejor que no llegue nunca al sitemap.
        return (
          !page.includes("/test/") &&
          !page.includes("/_dev/") &&
          !page.includes("/dev/componentes")
        );
      },
      changefreq: "weekly",
      priority: 0.7,
    }),
  ],
  vite: viteConfig,
});
