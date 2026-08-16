import { test, expect } from "@playwright/test";
import { setupPageForVisualTest, waitForPageReady } from "./visual-helpers";

// Configuración común para TODOS los tests del fichero. A nivel de fichero y no
// dentro de un describe: los bloques Mobile y Tablet se quedaban sin él.
test.beforeEach(async ({ page }) => {
  await setupPageForVisualTest(page);
});

test.describe("Visual Regression Tests", () => {
  test("Homepage - Español", async ({ page }) => {
    await page.goto("/es");

    // Esperar a que el contenido principal se cargue
    await page.waitForSelector("h1", { state: "visible" });
    await waitForPageReady(page);

    // Screenshot de la página completa
    await expect(page).toHaveScreenshot("homepage-es.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("Homepage - English", async ({ page }) => {
    await page.goto("/en");

    await page.waitForSelector("h1", { state: "visible" });
    await waitForPageReady(page);

    await expect(page).toHaveScreenshot("homepage-en.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("Blog Landing Page - Español", async ({ page }) => {
    await page.goto("/es/blog");

    // Esperar a que los posts se carguen
    await page.waitForSelector('[aria-label="grid-card"]', {
      state: "visible",
    });
    await waitForPageReady(page);

    await expect(page).toHaveScreenshot("blog-landing-es.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("Blog Landing Page - English", async ({ page }) => {
    await page.goto("/en/blog");

    await page.waitForSelector('[aria-label="grid-card"]', {
      state: "visible",
    });
    await waitForPageReady(page);

    const gridCard = page.locator('[aria-label="grid-card"]');
    const nav = page.getByRole("navigation");
    await expect(page).toHaveScreenshot("blog-landing-en.png", {
      fullPage: true,
      animations: "disabled",
      mask: [nav, gridCard],
    });
  });

  test("Search Page - Español", async ({ page }) => {
    await page.goto("/es/search");

    const searchInput = page.locator('input[type="search"]:visible').first();
    await searchInput.waitFor({ state: "visible" });
    await waitForPageReady(page);

    await expect(page).toHaveScreenshot("search-page-es.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("About Page - Español", async ({ page }) => {
    await page.goto("/es/about");

    await page.waitForSelector("h1", { state: "visible" });
    await waitForPageReady(page);

    await expect(page).toHaveScreenshot("about-page-es.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("Tags Page - Español", async ({ page }) => {
    await page.goto("/es/tags");

    const titleElement = page.locator("h2:visible").first();
    await titleElement.waitFor({ state: "visible" });
    await waitForPageReady(page);

    await expect(page).toHaveScreenshot("tags-page-es.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("Blog Post Detail - Functional Programming", async ({ page }) => {
    await page.goto("/es/blog/functional/functional-programming");

    await page.waitForSelector("h1", { state: "visible" });
    await waitForPageReady(page);

    await expect(page).toHaveScreenshot(
      "blog-post-functional-programming.png",
      {
        fullPage: true,
        animations: "disabled",
      }
    );
  });

  test("Blog Card Grid Component", async ({ page }) => {
    await page.goto("/es/blog");

    await page.waitForSelector('[aria-label="grid-card"]', {
      state: "visible",
    });
    await waitForPageReady(page);

    // Screenshot específico del grid de cards
    const gridElement = page.locator('[aria-label="posts-list"]').first();
    await expect(gridElement).toHaveScreenshot("blog-card-grid-component.png", {
      animations: "disabled",
    });
  });

  test("Header Navigation Component", async ({ page }) => {
    await page.goto("/es");

    await page.waitForSelector('[aria-label="header"]', { state: "visible" });
    await waitForPageReady(page);

    // Screenshot específico del header
    const headerElement = page.locator('[aria-label="header"]').first();
    await expect(headerElement).toHaveScreenshot(
      "header-navigation-component.png",
      {
        animations: "disabled",
      }
    );
  });

  test("Theme Toggle - Dark Mode", async ({ page }) => {
    await page.goto("/es");

    // Cambiar a modo oscuro
    const themeToggle = page.getByRole("button", { name: /toggle dark mode/i });
    await themeToggle.click();

    // Esperar a que el tema cambie de forma determinista
    await page.waitForFunction(() =>
      document.documentElement.classList.contains("dark")
    );

    await expect(page).toHaveScreenshot("homepage-dark-mode.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});

test.describe("Visual Regression - Mobile", () => {
  test.use({
    viewport: { width: 375, height: 667 }, // iPhone SE
  });

  test("Homepage Mobile - Español", async ({ page }) => {
    await page.goto("/es");

    await page.waitForSelector("h1", { state: "visible" });
    await waitForPageReady(page);

    await expect(page).toHaveScreenshot("homepage-mobile-es.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("Blog Landing Mobile - Español", async ({ page }) => {
    await page.goto("/es/blog");

    await page.waitForSelector('[aria-label="grid-card"]', {
      state: "visible",
    });
    await waitForPageReady(page);

    await expect(page).toHaveScreenshot("blog-landing-mobile-es.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("Mobile Navigation Menu", async ({ page }) => {
    await page.goto("/es");

    // Buscar el botón de menú móvil (hamburger)
    const menuButton = page.getByRole("button", { name: /menu/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(300);

      await expect(page).toHaveScreenshot("mobile-navigation-menu.png", {
        animations: "disabled",
      });
    }
  });
});

test.describe("Visual Regression - Tablet", () => {
  test.use({
    viewport: { width: 768, height: 1024 }, // iPad
  });

  test("Homepage Tablet - Español", async ({ page }) => {
    await page.goto("/es");

    await page.waitForSelector("h1", { state: "visible" });
    await waitForPageReady(page);

    await expect(page).toHaveScreenshot("homepage-tablet-es.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("Blog Grid Tablet Layout", async ({ page }) => {
    await page.goto("/es/blog");

    await page.waitForSelector('[aria-label="grid-card"]', {
      state: "visible",
    });
    await waitForPageReady(page);

    await expect(page).toHaveScreenshot("blog-grid-tablet-layout.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});
