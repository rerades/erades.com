import { test, expect } from "@playwright/test";
import {
  setupPageForVisualTest,
  waitForPageReady,
  hideCardImagesOnInit,
} from "./visual-helpers";

// A nivel de fichero: los bloques Responsive Behavior y Error States se
// quedaban sin esta configuración.
test.beforeEach(async ({ page }) => {
  await setupPageForVisualTest(page);
  await hideCardImagesOnInit(page);
});

test.describe("Component Visual Regression", () => {
  test("BlogCard Component - Various States", async ({ page }) => {
    await page.goto("/es/blog");
    await waitForPageReady(page);

    // Hacer scroll up para mostrar la barra superior
    await page.evaluate(() => window.scrollTo(0, 0));
    // Ya no usamos esperas arbitrarias

    await page.waitForSelector('[aria-label="grid-card"]', {
      state: "visible",
    });
    await waitForPageReady(page);

    // Screenshot de la primera tarjeta de blog
    const firstCard = page.locator('[aria-label="grid-card"]').first();
    await expect(firstCard).toHaveScreenshot("blog-card-default.png");

    // Test hover state (si aplica)
    await firstCard.hover();
    await page.waitForTimeout(200);
    await expect(firstCard).toHaveScreenshot("blog-card-hover.png");
  });

  test("BlogFilters Component", async ({ page }) => {
    await page.goto("/es/blog");
    await waitForPageReady(page);

    // Buscar el componente de filtros si existe
    const filtersElement = page
      .locator(
        '[data-testid="blog-filters"], .blog-filters, [aria-label*="filter"]'
      )
      .first();
    if (await filtersElement.isVisible()) {
      await expect(filtersElement).toHaveScreenshot(
        "blog-filters-component.png"
      );
    }
  });

  test("SearchInput Component", async ({ page }) => {
    await page.goto("/es/search");
    await waitForPageReady(page);

    const searchInput = page.locator('input[type="search"]:visible').first();
    await expect(searchInput).toHaveScreenshot("search-input-empty.png");

    // Estado con texto
    await searchInput.fill("functional programming");
    await expect(searchInput).toHaveScreenshot("search-input-filled.png");
  });

  test("ThemeToggle Component States", async ({ page }) => {
    await page.goto("/es");
    await waitForPageReady(page);

    // Encontrar el botón de toggle de tema
    const themeToggle = page.getByRole("button", { name: /toggle dark mode/i });
    await expect(themeToggle).toHaveScreenshot("theme-toggle-light.png");

    // Cambiar a modo oscuro
    await themeToggle.click();
    await page.waitForTimeout(300);
    await expect(themeToggle).toHaveScreenshot("theme-toggle-dark.png");
  });

  test("Paginator Component", async ({ page }) => {
    // Ir a una página que tenga paginación
    await page.goto("/es/blog");
    await waitForPageReady(page);

    // Buscar el componente de paginación
    const paginator = page
      .locator(
        '[aria-label*="pagination"], nav[role="navigation"], .pagination'
      )
      .first();
    if (await paginator.isVisible()) {
      await expect(paginator).toHaveScreenshot("paginator-component.png");
    }
  });

  test("ViewModeToggle Component", async ({ page }) => {
    await page.goto("/es/blog");
    await waitForPageReady(page);

    // Buscar el toggle de modo de vista (grid/list)
    const viewToggle = page
      .locator(
        '[aria-label*="view"], .view-toggle, button[data-testid*="view"]'
      )
      .first();
    if (await viewToggle.isVisible()) {
      await expect(viewToggle).toHaveScreenshot("view-mode-toggle.png");

      // Cambiar modo y capturar
      await viewToggle.click();
      await page.waitForTimeout(300);
      await expect(viewToggle).toHaveScreenshot(
        "view-mode-toggle-switched.png"
      );
    }
  });

  test("SocialProfileMenu Component", async ({ page }) => {
    await page.goto("/es");
    await waitForPageReady(page);

    // Buscar el menú de perfil social
    const socialMenu = page
      .locator(
        '[aria-label*="social"], .social-menu, nav[data-testid*="social"]'
      )
      .first();
    if (await socialMenu.isVisible()) {
      await expect(socialMenu).toHaveScreenshot("social-profile-menu.png");
    }
  });

  test("FormattedDate Component", async ({ page }) => {
    await page.goto("/es/blog");
    await waitForPageReady(page);

    // Buscar elementos de fecha en los posts
    const dateElement = page
      .locator('time, [datetime], .date, [aria-label*="date"]')
      .first();
    if (await dateElement.isVisible()) {
      await expect(dateElement).toHaveScreenshot(
        "formatted-date-component.png"
      );
    }
  });

  test("NoResults Component", async ({ page }) => {
    await page.goto("/es/search?q=resultadosquenoexistendeberia");
    await waitForPageReady(page);

    const noResultsElement = page
      .locator('[aria-label*="no result"], .no-results, .empty-state')
      .first();
    if (await noResultsElement.isVisible()) {
      await expect(noResultsElement).toHaveScreenshot(
        "no-results-component.png"
      );
    }
  });

  test("ResultsInfo Component", async ({ page }) => {
    await page.goto("/es/search?q=functional");
    await waitForPageReady(page);

    const resultsInfo = page
      .locator('[aria-label*="result"], .results-info, .search-summary')
      .first();
    if (await resultsInfo.isVisible()) {
      await expect(resultsInfo).toHaveScreenshot("results-info-component.png");
    }
  });
});

test.describe("Component Responsive Behavior", () => {
  const viewports = [
    // { name: "mobile", width: 375, height: 667 }, // FIXME: Add mobile viewport, right now if failing randomly on CI
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1280, height: 720 },
  ];

  for (const viewport of viewports) {
    test(`BlogCardGrid responsive - ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/es/blog");

      await page.waitForSelector('[aria-label="posts-list"]', {
        state: "visible",
      });

      const gridElement = page.locator('[aria-label="posts-list"]').first();
      await expect(gridElement).toHaveScreenshot(
        `blog-card-grid-${viewport.name}.png`
      );
    });

    test(`Header navigation responsive - ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/es");

      await page.waitForSelector('[aria-label="header"]', { state: "visible" });

      const headerElement = page.locator('[aria-label="header"]').first();
      await expect(headerElement).toHaveScreenshot(
        `header-navigation-${viewport.name}.png`
      );
    });
  }
});

test.describe("Component Error States", () => {
  test("Search Component - Error State", async ({ page }) => {
    // Simular un error de red interceptando requests
    await page.route("**/api/search**", (route) => {
      route.abort("failed");
    });

    await page.goto("/es/search");
    const searchInput = page.locator('input[type="search"]:visible').first();
    await searchInput.fill("test query");
    await searchInput.press("Enter");

    await page.waitForTimeout(2000);

    // Capturar el estado de error si existe
    const errorElement = page
      .locator('.error, [role="alert"], .search-error')
      .first();
    if (await errorElement.isVisible()) {
      await expect(errorElement).toHaveScreenshot("search-error-state.png");
    }
  });

  test("Blog Component - Loading State", async ({ page }) => {
    // Interceptar requests para simular carga lenta
    await page.route("**/blog**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      route.continue();
    });

    const navigation = page.goto("/es/blog");

    // Capturar estado de carga si existe
    const loadingElement = page
      .locator('.loading, .spinner, [aria-label*="loading"]')
      .first();
    if (await loadingElement.isVisible()) {
      await expect(loadingElement).toHaveScreenshot("blog-loading-state.png");
    }

    await navigation;
  });
});
