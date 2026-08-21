import { test, expect } from "@playwright/test";

// Cubre el §6.1 del brief. El overlay hecho a mano tenía `aria-hidden="true"`
// escrito en el markup y `toggleMobileMenu()` nunca lo tocaba: con el menú
// abierto y visible se seguía anunciando como oculto. Faltaban además focus
// trap y devolución del foco al disparador.
test.describe("Menú móvil", () => {
  const trigger = "#mobile-menu-btn";
  const content = '[data-slot="dialog-content"]';

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/es");
  });

  test("abierto se anuncia como diálogo, no como contenido oculto", async ({
    page,
  }) => {
    await page.locator(trigger).click();

    const dialog = page.locator(content);
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("role", "dialog");
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    // La regresión concreta: antes esto era "true" con el menú abierto.
    await expect(dialog).not.toHaveAttribute("aria-hidden", "true");
    await expect(page.locator(trigger)).toHaveAttribute("aria-expanded", "true");
  });

  test("atrapa el foco dentro del menú", async ({ page }) => {
    await page.locator(trigger).click();
    await expect(page.locator(content)).toBeVisible();

    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(
        () => !!document.activeElement?.closest('[data-slot="dialog-content"]')
      );
      expect(inside).toBe(true);
    }
  });

  test("Escape cierra y devuelve el foco al disparador", async ({ page }) => {
    await page.locator(trigger).click();
    await expect(page.locator(content)).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.locator(content)).toBeHidden();
    await expect(page.locator(trigger)).toBeFocused();
  });

  test("bloquea el scroll del fondo mientras está abierto", async ({ page }) => {
    await page.locator(trigger).click();
    await expect(page.locator(content)).toBeVisible();

    await page.mouse.wheel(0, 600);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);

    await page.keyboard.press("Escape");
    await expect(page.locator(content)).toBeHidden();

    await page.mouse.wheel(0, 600);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(0);
  });

  test("se cierra al pasar a viewport de escritorio", async ({ page }) => {
    await page.locator(trigger).click();
    await expect(page.locator(content)).toBeVisible();

    await page.setViewportSize({ width: 1280, height: 800 });

    await expect(page.locator(content)).toBeHidden();
  });

  test("navegar por un enlace del menú lo cierra", async ({ page }) => {
    await page.locator(trigger).click();
    await expect(page.locator(content)).toBeVisible();

    await page.locator(`${content} a[href="/es/blog"]`).first().click();

    await expect(page).toHaveURL(/\/es\/blog/);
    await expect(page.locator(content)).toBeHidden();
  });
});
