import { defineConfig, devices } from "@playwright/test";
import os from "os";

// Config exclusivo para regresión visual (sin webServer)
export default defineConfig({
  testDir: "tests/visual-regression",
  timeout: 30 * 1000,
  reporter: [["html", { open: "never" }]],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Sin reintentos, a proposito. Toda esta config se apoya en que el render
  // es determinista: imagen fijada en CI, esperas explicitas de fuentes e
  // imagenes, animaciones desactivadas. Si eso es cierto, reintentar solo
  // triplica lo que tarda CI en dar un rojo legitimo; y si resulta falso,
  // preferimos verlo como un fallo y estabilizar la captura, que es lo mismo
  // que dice el comentario de `maxDiffPixels` mas abajo.
  //
  // Si empieza a haber rojos intermitentes, el arreglo NO es volver a
  // `retries: 2`: es encontrar que captura no es estable.
  retries: 0,
  workers: process.env.CI ? 4 : Math.ceil(os.cpus().length * 0.75),

  use: {
    // BASE_URL debe apuntar a un servidor ya arrancado (host o externo)
    baseURL: process.env.BASE_URL || "http://localhost:4321",
    headless: true,
    trace: "off",
    // `retain-on-failure` graba video de los 25 tests y lo tira al pasar. En
    // una suite visual el artefacto util es el `-diff.png`, no un video de una
    // pagina estatica.
    video: "off",
    screenshot: "only-on-failure",
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      // Umbral apretado a propósito. Con maxDiffPixels: 1000 (0,08% de una
      // captura de 1280x1000) se colaban cambios de contenido reales: la
      // baseline del paginador decía "Mostrando 6 de 19 resultados" mientras la
      // página servía 21, y el test pasaba.
      //
      // En CI el navegador siempre es el mismo (la imagen fijada en el
      // `container:` del job Visual-Regression-Tests), así que el render es
      // determinista y no hace falta colchón para ruido entre máquinas. Si esto empieza a dar falsos
      // positivos, la respuesta es estabilizar la captura, no subir el número.
      threshold: 0.15,
      maxDiffPixels: 100,
      animations: "disabled",
    },
    toMatchSnapshot: { threshold: 0.15 },
  },
});
