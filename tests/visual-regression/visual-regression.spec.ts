import { test, expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import {
  setupPageForVisualTest,
  waitForPageReady,
  hideCardImagesOnInit,
  VIEWPORTS,
} from "./visual-helpers";

/**
 * Regresión visual. Un único fichero a propósito: antes esto vivía repartido en
 * tres (`visual-regression`, `visual-regression-enhanced`, `component-visual`)
 * que capturaban las mismas páginas con distinto nombre — 16 de las 64
 * baselines eran byte a byte idénticas a otra.
 *
 * Reglas de este fichero:
 *
 * 1. Cada página/estado/viewport se captura UNA vez.
 * 2. Nada de `if (await el.isVisible())` alrededor de una captura. Si el
 *    elemento no está, el test debe fallar; envolverlo hace que pase sin
 *    comprobar nada, que es como se colaron seis tests que no capturaban nada.
 * 3. Si un estado interactivo no cambia ni un píxel respecto al estado base, no
 *    merece captura propia.
 */

test.beforeEach(async ({ page }) => {
  await setupPageForVisualTest(page);
  await hideCardImagesOnInit(page);
});

/** Espera a que la página esté lista y devuelve el locator pedido, ya visible. */
async function ready(page: Page, selector: string): Promise<Locator> {
  await page.waitForSelector(selector, { state: "visible" });
  await waitForPageReady(page);
  return page.locator(selector).first();
}

test.describe("Páginas completas - desktop", () => {
  test("Home - es", async ({ page }) => {
    await page.goto("/es");
    await ready(page, "h1");
    await expect(page).toHaveScreenshot("homepage-es.png", { fullPage: true });
  });

  test("Home - en", async ({ page }) => {
    await page.goto("/en");
    await ready(page, "h1");
    await expect(page).toHaveScreenshot("homepage-en.png", { fullPage: true });
  });

  test("Home - modo oscuro", async ({ page }) => {
    await page.goto("/es");
    await ready(page, "h1");
    await page.getByRole("button", { name: /toggle dark mode/i }).click();
    await page.waitForFunction(() =>
      document.documentElement.classList.contains("dark")
    );
    await expect(page).toHaveScreenshot("homepage-dark.png", {
      fullPage: true,
    });
  });

  test("Listado de blog - es", async ({ page }) => {
    await page.goto("/es/blog");
    await ready(page, '[aria-label="grid-card"]');
    await expect(page).toHaveScreenshot("blog-landing-es.png", {
      fullPage: true,
    });
  });

  test("Listado de blog - en", async ({ page }) => {
    await page.goto("/en/blog");
    await ready(page, '[aria-label="grid-card"]');
    await expect(page).toHaveScreenshot("blog-landing-en.png", {
      fullPage: true,
    });
  });

  test("Detalle de post", async ({ page }) => {
    await page.goto("/es/blog/functional/functional-programming");
    await ready(page, "h1");
    await expect(page).toHaveScreenshot("blog-post.png", { fullPage: true });
  });

  test("Página de tags", async ({ page }) => {
    await page.goto("/es/tags");
    await ready(page, "h2:visible");
    await expect(page).toHaveScreenshot("tags-page.png", { fullPage: true });
  });

  test("Página about", async ({ page }) => {
    await page.goto("/es/about");
    await ready(page, "h1");
    await expect(page).toHaveScreenshot("about-page.png", { fullPage: true });
  });

  test("404", async ({ page }) => {
    const response = await page.goto("/es/pagina-que-no-existe");
    expect(response?.status()).toBe(404);
    await ready(page, "h1");
    await expect(page).toHaveScreenshot("404-page.png", { fullPage: true });
  });
});

test.describe("Buscador", () => {
  /** Escribe en el buscador y espera a la página de resultados. */
  async function search(page: Page, query: string): Promise<void> {
    const input = page.locator('input[type="search"]:visible').first();
    await input.waitFor({ state: "visible" });
    await input.fill(query);
    await input.press("Enter");
    await page.waitForURL(/\/es\/search\?.*q=/);
    await waitForPageReady(page);
  }

  test("Sin búsqueda", async ({ page }) => {
    await page.goto("/es/search");
    await ready(page, 'input[type="search"]:visible');
    await expect(page).toHaveScreenshot("search-empty.png", {
      fullPage: true,
    });
  });

  test("Con resultados", async ({ page }) => {
    await page.goto("/es/search");
    await waitForPageReady(page);
    await search(page, "functional programming");

    // El valor del test está en que se vean resultados de verdad: la baseline
    // anterior de esta captura mostraba "No se encontraron resultados" y nadie
    // se dio cuenta durante meses.
    await expect(page.locator('[aria-label="grid-card"]').first()).toBeVisible();
    await expect(page).toHaveScreenshot("search-results.png", {
      fullPage: true,
    });
  });

  test("Sin resultados", async ({ page }) => {
    await page.goto("/es/search");
    await waitForPageReady(page);
    await search(page, "resultadosquenoexistendeberia");

    await expect(page.locator('[aria-label="grid-card"]')).toHaveCount(0);
    await expect(page).toHaveScreenshot("search-no-results.png", {
      fullPage: true,
    });
  });
});

test.describe("Móvil", () => {
  test.use({ viewport: VIEWPORTS.mobile });

  test("Home", async ({ page }) => {
    await page.goto("/es");
    await ready(page, "h1");
    await expect(page).toHaveScreenshot("homepage-mobile.png", {
      fullPage: true,
    });
  });

  test("Listado de blog", async ({ page }) => {
    await page.goto("/es/blog");
    await ready(page, '[aria-label="grid-card"]');
    await expect(page).toHaveScreenshot("blog-landing-mobile.png", {
      fullPage: true,
    });
  });

  test("Menú de navegación abierto", async ({ page }) => {
    await page.goto("/es");
    await waitForPageReady(page);
    await page.getByRole("button", { name: /menu/i }).click();
    await expect(page).toHaveScreenshot("mobile-menu-open.png", {
      fullPage: true,
    });
  });
});

test.describe("Tablet", () => {
  test.use({ viewport: VIEWPORTS.tablet });

  test("Home", async ({ page }) => {
    await page.goto("/es");
    await ready(page, "h1");
    await expect(page).toHaveScreenshot("homepage-tablet.png", {
      fullPage: true,
    });
  });

  test("Listado de blog", async ({ page }) => {
    await page.goto("/es/blog");
    await ready(page, '[aria-label="grid-card"]');
    await expect(page).toHaveScreenshot("blog-landing-tablet.png", {
      fullPage: true,
    });
  });
});

test.describe("Componentes", () => {
  test("Header", async ({ page }) => {
    await page.goto("/es");
    const header = await ready(page, '[aria-label="header"]');
    await expect(header).toHaveScreenshot("header.png");
  });

  test("Header - tablet", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto("/es");
    const header = await ready(page, '[aria-label="header"]');
    await expect(header).toHaveScreenshot("header-tablet.png");
  });

  test("Tarjeta de post - normal, hover y foco", async ({ page }) => {
    await page.goto("/es/blog");
    const card = await ready(page, '[aria-label="grid-card"]');

    await expect(card).toHaveScreenshot("blog-card.png");

    await card.hover();
    await expect(card).toHaveScreenshot("blog-card-hover.png");

    await card.focus();
    await expect(card).toHaveScreenshot("blog-card-focus.png");
  });

  test("Grid de posts", async ({ page }) => {
    await page.goto("/es/blog");
    const grid = await ready(page, '[aria-label="posts-list"]');
    await expect(grid).toHaveScreenshot("blog-grid.png");
  });

  test("Grid de posts - tablet", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto("/es/blog");
    const grid = await ready(page, '[aria-label="posts-list"]');
    await expect(grid).toHaveScreenshot("blog-grid-tablet.png");
  });

  test("Paginador", async ({ page }) => {
    await page.goto("/es/blog");
    const paginator = await ready(page, 'nav[role="navigation"]');
    await expect(paginator).toHaveScreenshot("paginator.png");
  });

  test("Buscador - vacío y con texto", async ({ page }) => {
    await page.goto("/es/search");
    const input = await ready(page, 'input[type="search"]:visible');

    await expect(input).toHaveScreenshot("search-input-empty.png");

    await input.fill("functional programming");
    await expect(input).toHaveScreenshot("search-input-filled.png");
  });

  test("Toggle de tema - claro y oscuro", async ({ page }) => {
    await page.goto("/es");
    await waitForPageReady(page);
    const toggle = page.getByRole("button", { name: /toggle dark mode/i });

    await expect(toggle).toHaveScreenshot("theme-toggle-light.png");

    await toggle.click();
    await page.waitForFunction(() =>
      document.documentElement.classList.contains("dark")
    );
    await expect(toggle).toHaveScreenshot("theme-toggle-dark.png");
  });
});
