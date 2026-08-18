/// <reference types="vitest" />
import { getViteConfig } from "astro/config";
import { fileURLToPath } from "node:url";

export default getViteConfig({
  resolve: {
    alias: {
      "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "./src/test/happy-dom-ssr.ts",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx,js}", "src/**/*.spec.{ts,tsx,js}"],
    exclude: [
      "node_modules",
      "dist",
      ".astro",
      "tests",
      "public/js/experiments/vector.test.js",
    ],
  },
});
