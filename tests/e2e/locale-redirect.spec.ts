import { test, expect } from "@playwright/test";

test.describe("Redirección de idioma en la raíz", () => {
  test("redirige a /es o /en y muestra el idioma activo", async ({ page }) => {
    await page.goto("/");
    // Espera la redirección y extrae el idioma de la URL
    await expect(page).toHaveURL(/\/([a-z]{2})(\/)?$/);
    const url = page.url();
    const match = url.match(/\/([a-z]{2})(\/)?$/);
    expect(match).not.toBeNull();
    const lang = match ? match[1] : "";
    // Busca el botón activo con aria-current="page" y compara el texto
    const activeBtn = page.locator('button[aria-current="page"]').first();
    await expect(activeBtn).toBeVisible();
    const btnText = (await activeBtn.textContent())?.trim().toUpperCase();
    expect(btnText).toBe(lang.toUpperCase());
  });

  test("cambia de idioma y lo comprueba en la URL", async ({ page }) => {
    await page.goto("/");
    // Espera la redirección y extrae el idioma actual
    await expect(page).toHaveURL(/\/([a-z]{2})(\/)?$/);
    const url = page.url();
    const match = url.match(/\/([a-z]{2})(\/)?$/);
    expect(match).not.toBeNull();
    const currentLang = match ? match[1] : "";
    // Determina el idioma alternativo
    const altLang = currentLang === "es" ? "en" : "es";
    // Busca el botón del idioma alternativo (que NO tiene aria-current="page")
    const altBtn = page
      .locator(
        `button[data-lang-switch="${altLang}"]:not([aria-current="page"])`,
      )
      .first();
    await expect(altBtn).toBeVisible();
    await altBtn.click();
    // Comprueba que la URL cambia al idioma alternativo
    await expect(page).toHaveURL(new RegExp(`/${altLang}(/|$)`));
  });

  // Regresion: los botones ES/EN del menu movil compartian id con los de
  // escritorio, asi que getElementById solo enganchaba los primeros y los del
  // movil no hacian nada.
  test("los botones de idioma del menu movil cambian de idioma", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/es");

    await page.locator("#mobile-menu-btn").click();
    const overlay = page.locator("#mobile-menu-overlay");
    await expect(overlay).toBeVisible();

    await overlay.locator('button[data-lang-switch="en"]').click();
    await expect(page).toHaveURL(/\/en(\/|$)/);
  });
});

// Un post sin traducción no declara hreflang. Hoy todos la tienen (lo exige
// src/content/translation-pairs.test.ts), así que se simula quitando el link.
test.describe("Selector de idioma en un post", () => {
  test("salta a la traducción declarada por hreflang", async ({ page }) => {
    await page.goto("/en/blog/functional/monads/");
    await page.locator('button[data-lang-switch="es"]').first().click();
    await expect(page).toHaveURL(/\/es\/blog\/funcional\/monadas\/$/);
  });

  test("sin traducción cae al listado del blog, no a un 404", async ({
    page,
  }) => {
    await page.goto("/en/blog/functional/monads/");
    await page.evaluate(() =>
      document
        .querySelectorAll('link[rel="alternate"][hreflang]')
        .forEach((l) => l.remove()),
    );
    await page.locator('button[data-lang-switch="es"]').first().click();
    await expect(page).toHaveURL(/\/es\/blog\/$/);
  });

  test("la paginación del blog conserva la ruta", async ({ page }) => {
    await page.goto("/es/blog/page/2/");
    await page.locator('button[data-lang-switch="en"]').first().click();
    await expect(page).toHaveURL(/\/en\/blog\/page\/2\/?$/);
  });
});
