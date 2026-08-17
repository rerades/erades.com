import { test, expect } from "@playwright/test";
import {
  waitForPageReady,
  setupPageForVisualTest,
  screenshotPage,
  screenshotComponent,
  testResponsiveComponent,
  setViewport,
  VIEWPORTS,
  waitForElement,
  hideCardImagesOnInit,
} from "./visual-helpers";

/**
 * Tests de regresión visual mejorados usando utilidades comunes
 * Este archivo demuestra cómo usar las utilidades para tests más limpios y consistentes
 */

// Solo para snapshots: oculta las imágenes de tarjeta, que no se cargan de
// forma determinista antes de una captura fullPage.
test.beforeEach(async ({ page }) => {
  await hideCardImagesOnInit(page);
});

test.describe("Enhanced Visual Regression Tests", () => {
  test.beforeEach(async ({ page }) => {
    await setupPageForVisualTest(page);
  });

  test("Homepage Complete Flow - Español", async ({ page }) => {
    await page.goto("/es");
    await waitForPageReady(page);

    // Screenshot inicial
    await screenshotPage(page, "homepage-enhanced-es.png");

    // Test tema oscuro
    const themeToggle = page.getByRole("button", { name: /toggle dark mode/i });
    await themeToggle.click();
    await page.waitForTimeout(300);

    await screenshotPage(page, "homepage-enhanced-dark-es.png");
  });

  test("Blog Card Grid - Multiple States", async ({ page }) => {
    await page.goto("/es/blog");
    await waitForPageReady(page);

    const gridSelector = '[aria-label="posts-list"]';

    // Test estados diferentes del grid
    await testResponsiveComponent(page, gridSelector, "blog-grid-enhanced", [
      "mobile",
      "tablet",
      "desktop",
    ]);
  });

  test("Search Functionality Visual Flow", async ({ page }) => {
    await page.goto("/es/search");
    await waitForPageReady(page);

    // Estado inicial vacío
    await screenshotPage(page, "search-empty-enhanced.png");

    // Estado con búsqueda
    const searchInput = page.locator('input[type="search"]:visible').first();
    await searchInput.waitFor({ state: "visible" });
    await searchInput.fill("functional programming");
    await searchInput.press("Enter");
    await page.waitForTimeout(1500);

    await screenshotPage(page, "search-results-enhanced.png");
  });

  test("Search No Results State", async ({ page }) => {
    await page.goto("/es/search");
    await waitForPageReady(page);

    // Estado sin resultados - test separado para más estabilidad
    const searchInput = page.locator('input[type="search"]:visible').first();
    await searchInput.waitFor({ state: "visible" });
    await searchInput.fill("resultadosquenoexistendeberia");
    await searchInput.press("Enter");
    await page.waitForTimeout(1500);

    await screenshotPage(page, "search-no-results-enhanced.png");
  });

  test("Navigation Component States", async ({ page }) => {
    await page.goto("/es");
    await waitForPageReady(page);

    const headerElement = await waitForElement(page, '[aria-label="header"]');

    // Test diferentes estados del header
    const states = [
      {
        name: "default",
        setup: async () => {
          // Estado por defecto - no hacer nada
        },
      },
      {
        name: "hover-blog-link",
        setup: async () => {
          // Acotado al header: el footer tiene otro enlace a /blog con el
          // mismo nombre accesible.
          const blogLink = page
            .getByLabel("header")
            .getByRole("link", { name: "Blog" });
          await blogLink.hover();
          await page.waitForTimeout(200);
        },
      },
    ];

    for (const state of states) {
      await state.setup();
      await screenshotComponent(
        headerElement,
        `header-navigation-enhanced-${state.name}.png`
      );
    }
  });

  test("Mobile Menu Interaction", async ({ page }) => {
    await setViewport(page, "mobile");
    await page.goto("/es");
    await waitForPageReady(page);

    // Screenshot estado inicial móvil
    await screenshotPage(page, "mobile-initial-enhanced.png");

    // Buscar botón de menú móvil
    const menuButton = page.getByRole("button", { name: /menu/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(300);

      await screenshotPage(page, "mobile-menu-open-enhanced.png");
    }
  });

  test("Blog Post Detail - Complete Layout", async ({ page }) => {
    await page.goto("/es/blog/functional/functional-programming");
    await waitForPageReady(page);

    // Screenshot del post completo
    await screenshotPage(page, "blog-post-detail-enhanced.png");

    // Test responsive del contenido del post
    await testResponsiveComponent(
      page,
      "main article",
      "blog-post-content-enhanced",
      ["mobile", "desktop"]
    );
  });

  test("Theme Toggle - All States", async ({ page }) => {
    await page.goto("/es");
    await waitForPageReady(page);

    const themeToggle = page.getByRole("button", { name: /toggle dark mode/i });

    // Estado claro
    await screenshotComponent(themeToggle, "theme-toggle-enhanced-light.png");

    // Cambiar a oscuro
    await themeToggle.click();
    await page.waitForTimeout(300);

    await screenshotComponent(themeToggle, "theme-toggle-enhanced-dark.png");

    // Screenshot de toda la página en modo oscuro
    await screenshotPage(page, "full-page-dark-mode-enhanced.png");
  });

  test("Error States Visual", async ({ page }) => {
    // Test página 404 (si existe)
    const response = await page.goto("/es/pagina-que-no-existe", {
      waitUntil: "networkidle",
    });

    if (response?.status() === 404) {
      const nav = page.getByRole("navigation");
      const notFound = page.getByRole("heading", {
        name: "Página no encontrada",
      });
      await screenshotPage(page, "404-page-enhanced.png", {
        mask: [nav, notFound],
      });
    }
  });
});

test.describe("Enhanced Responsive Tests", () => {
  const criticalPages = [
    { path: "/es", name: "homepage" },
    { path: "/es/blog", name: "blog-landing" },
    { path: "/es/search", name: "search-page" },
    { path: "/es/about", name: "about-page" },
  ];

  const viewportsToTest = ["mobile", "tablet", "desktop"] as const;

  for (const viewport of viewportsToTest) {
    test.describe(`${viewport.toUpperCase()} viewport`, () => {
      test.beforeEach(async ({ page }) => {
        await setupPageForVisualTest(page);
        await setViewport(page, viewport);
      });

      for (const pageDef of criticalPages) {
        test(`${pageDef.name} - ${viewport}`, async ({ page }) => {
          await page.goto(pageDef.path);
          await waitForPageReady(page);

          await screenshotPage(
            page,
            `${pageDef.name}-${viewport}-enhanced.png`
          );
        });
      }
    });
  }
});

test.describe("Enhanced Component Library", () => {
  test.beforeEach(async ({ page }) => {
    await setupPageForVisualTest(page);
  });

  test("All Blog Components in Context", async ({ page }) => {
    await page.goto("/es/blog");
    await waitForPageReady(page);

    // Test componentes específicos si están visibles
    const componentSelectors = [
      { selector: '[aria-label="posts-list"]', name: "blog-card-grid" },
      { selector: ".blog-filters", name: "blog-filters" },
      { selector: 'nav[role="navigation"]', name: "pagination" },
      { selector: ".view-toggle", name: "view-toggle" },
    ];

    for (const component of componentSelectors) {
      const element = page.locator(component.selector).first();
      if (await element.isVisible()) {
        await screenshotComponent(
          element,
          `component-${component.name}-enhanced.png`
        );
      }
    }
  });

  test("Interactive Component States", async ({ page }) => {
    await page.goto("/es/blog");
    await waitForPageReady(page);

    // Test hover states en las tarjetas
    const blogCards = page.locator('[aria-label="grid-card"]');
    const firstCard = blogCards.first();

    if (await firstCard.isVisible()) {
      // Estado normal
      await screenshotComponent(firstCard, "blog-card-enhanced-normal.png");

      // Estado hover
      await firstCard.hover();
      await page.waitForTimeout(200);
      await screenshotComponent(firstCard, "blog-card-enhanced-hover.png");

      // Estado focus (simulado)
      await firstCard.focus();
      await page.waitForTimeout(200);
      await screenshotComponent(firstCard, "blog-card-enhanced-focus.png");
    }
  });
});
