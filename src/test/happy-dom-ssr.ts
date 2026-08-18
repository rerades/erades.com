import { builtinEnvironments } from "vitest/environments";

// Astro 7 sustituye cualquier `.astro` por un stub que lanza
// "Astro components cannot be used in the browser" cuando Vite lo transforma en
// el entorno `client`. El Container API que usan los tests necesita la build
// SSR, así que reutilizamos happy-dom pero pidiendo el entorno `ssr` de Vite.
export default {
  ...builtinEnvironments["happy-dom"],
  name: "happy-dom-ssr",
  viteEnvironment: "ssr",
};
