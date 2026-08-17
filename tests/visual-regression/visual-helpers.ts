import type { Page } from "@playwright/test";

/**
 * Utilidades para tests de regresión visual
 */

/**
 * Espera a que una página esté completamente cargada para screenshots consistentes
 */
export const waitForPageReady = async (page: Page): Promise<void> => {
  // Esperar a que la red esté inactiva
  await page.waitForLoadState("networkidle");

  // Esperar a que las fuentes se carguen.
  //
  // Ojo con la forma: `waitForFunction(() => document.fonts.ready)` NO espera.
  // `document.fonts.ready` es una Promise, o sea siempre truthy, así que la
  // condición se cumplía en el primer sondeo y la captura salía a veces con la
  // fuente de fallback. `evaluate` sí resuelve la promesa antes de seguir.
  await page.evaluate(() => document.fonts.ready);

  // Asegurar que todas las imágenes (incluyendo lazy) estén visibles y decodificadas
  await ensureAllImagesLoaded(page);
};

/**
 * Deshabilita animaciones y transiciones para screenshots consistentes
 */
const disableAnimations = async (page: Page): Promise<void> => {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        ::before,
        ::after {
          animation-delay: -1ms !important;
          animation-duration: 1ms !important;
          animation-iteration-count: 1 !important;
          background-attachment: initial !important;
          scroll-behavior: auto !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      }
    `,
  });
};

/**
 * Configuraciones de viewport comunes
 */
export const VIEWPORTS = {
  mobile: { width: 375, height: 667 }, // iPhone SE
  tablet: { width: 768, height: 1024 }, // iPad
  desktop: { width: 1280, height: 720 }, // el de playwright.visual.config.ts
} as const;

/**
 * Intercepta y mockea requests para tests visuales consistentes
 */
const mockExternalRequests = async (page: Page): Promise<void> => {
  // Bloquear requests a recursos externos que podrían causar inconsistencias
  await page.route("**/*", (route) => {
    const url = route.request().url();

    // Permitir recursos del propio sitio
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
      route.continue();
      return;
    }

    // Bloquear analytics, ads, etc.
    const blockedDomains = [
      "google-analytics",
      "googletagmanager",
      "facebook.com/tr",
      "doubleclick.net",
    ];

    const shouldBlock = blockedDomains.some((domain) => url.includes(domain));
    if (shouldBlock) {
      route.abort();
      return;
    }

    // Continuar con otros requests
    route.continue();
  });
};

/**
 * Fuerza que todas las imágenes usen carga "eager" desde el inicio de la navegación
 * y reconcilia posibles atributos `data-src` usados por librerías de lazy-load.
 * Debe añadirse ANTES de `page.goto`, por eso se incluye dentro de `setupPageForVisualTest`.
 */
const forceEagerImagesOnInit = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    const makeImagesEager = (): void => {
      const images = Array.from(
        document.querySelectorAll<HTMLImageElement>("img")
      );
      for (const img of images) {
        if (img.getAttribute("loading") === "lazy") {
          img.setAttribute("loading", "eager");
        }
        const dataSrc = img.getAttribute("data-src");
        if (dataSrc && !img.getAttribute("src")) {
          img.setAttribute("src", dataSrc);
        }
      }
    };

    // Al parsear el DOM
    document.addEventListener("DOMContentLoaded", makeImagesEager);

    // Y también observar cambios dinámicos
    const observer = new MutationObserver(() => makeImagesEager());
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["loading", "src", "data-src"],
    });
  });
};

/**
 * Recorre la página para disparar cualquier lazy-load basado en viewport,
 * y espera a que TODAS las imágenes estén decodificadas y listas para pintar.
 * No usa esperas arbitrarias; se apoya en `HTMLImageElement.decode()` y estados `complete/naturalWidth`.
 */
const ensureAllImagesLoaded = async (page: Page): Promise<void> => {
  // Desplazamiento incremental por la página para activar observadores de intersección o native lazy
  await page.evaluate(async () => {
    // Quitar el lazy nativo antes de recorrer: si no, una imagen que solo pasa
    // brevemente por el viewport puede no llegar a cargarse nunca.
    for (const img of Array.from(document.images)) {
      if (img.getAttribute("loading") === "lazy") {
        img.setAttribute("loading", "eager");
      }
    }

    const total = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    const viewport = window.innerHeight || 800;
    const step = Math.max(1, Math.floor(total / 8));
    for (let y = 0; y <= total + viewport; y += step) {
      window.scrollTo(0, y);
      // ceder el hilo un frame para que el browser procese intersecciones
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 0));
    }
    window.scrollTo(0, 0);
  });

  // Esperar a que todas las imágenes estén decodificadas o, al menos, completas
  await page.waitForFunction(() => {
    const decodePromises: Array<Promise<unknown>> = [];
    const imgs = Array.from(document.images) as HTMLImageElement[];
    for (const img of imgs) {
      // Normalizar: si alguna librería usa data-src, asegúrate de moverlo a src
      const dataSrc = img.getAttribute("data-src");
      if (dataSrc && !img.getAttribute("src")) {
        img.setAttribute("src", dataSrc);
      }

      if (img.complete && img.naturalWidth > 0) {
        continue;
      }
      // `decode` fuerza la descarga si es necesario y espera a la decodificación
      if (typeof (img as any).decode === "function") {
        decodePromises.push((img as any).decode().catch(() => undefined));
      } else {
        decodePromises.push(
          new Promise((resolve) => {
            img.addEventListener("load", () => resolve(undefined), {
              once: true,
            });
            img.addEventListener("error", () => resolve(undefined), {
              once: true,
            });
          })
        );
      }
    }
    return Promise.all(decodePromises).then(() => {
      return imgs.every((img) => img.complete && img.naturalWidth > 0);
    });
  });

  // Asegurar que ya no quedan transferencias en vuelo
  await page.waitForLoadState("networkidle");
};

/**
 * Prepara una página para tests visuales con configuración estándar
 */
export const setupPageForVisualTest = async (page: Page): Promise<void> => {
  await disableAnimations(page);
  await forceEagerImagesOnInit(page);
  await mockExternalRequests(page);
};

/**
 * Oculta las imágenes de las tarjetas de post, manteniendo su hueco en el layout.
 *
 * Las imágenes bajo el pliegue no terminan de cargarse de forma reproducible
 * antes de una captura `fullPage`, y hacían fallar de forma intermitente los
 * screenshots del listado del blog: el mismo test producía imágenes distintas
 * en dos ejecuciones de CI seguidas.
 *
 * `visibility: hidden` conserva la caja, así que se siguen comprobando layout,
 * tipografía y colores; solo se dejan de comparar los píxeles de las fotos.
 * Se inyecta con `addInitScript` para que sobreviva a `page.goto`.
 *
 * Deliberadamente FUERA de `setupPageForVisualTest`: los tests e2e reutilizan
 * ese setup y allí ocultar imágenes no aporta nada y altera los tiempos de
 * carga. Lo llaman solo los specs de regresión visual.
 */
export const hideCardImagesOnInit = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    const inject = (): void => {
      if (document.getElementById("visual-test-hide-card-images")) return;
      const style = document.createElement("style");
      style.id = "visual-test-hide-card-images";
      style.textContent = `
        [aria-label="grid-card"] img,
        [aria-label="list-card"] img {
          visibility: hidden !important;
        }
      `;
      document.head?.appendChild(style);
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", inject);
    } else {
      inject();
    }
  });
};

