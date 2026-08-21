import { test, expect } from "@playwright/test";

// Cubre los huecos del §6.3 del brief: el dropdown hecho a mano gestionaba
// click-outside, Escape y aria-expanded, pero no tenía navegación con flechas,
// ni roles menu/menuitem, ni devolvía el foco al cerrar.
test.describe("Dropdown del avatar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/es");
  });

  const trigger = "#avatar-btn";
  const content = '[data-slot="dropdown-menu-content"]';

  test("el runtime aplica los roles y el estado ARIA", async ({ page }) => {
    const btn = page.locator(trigger);
    await expect(btn).toHaveAttribute("aria-haspopup", "menu");
    await expect(btn).toHaveAttribute("aria-expanded", "false");

    await btn.click();

    await expect(page.locator(content)).toBeVisible();
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(content)).toHaveAttribute("role", "menu");
    await expect(page.locator(`${content} [role="menuitem"]`)).toHaveCount(2);
  });

  test("se abre con teclado y las flechas recorren los ítems", async ({
    page,
  }) => {
    await page.locator(trigger).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(content)).toBeVisible();

    await page.keyboard.press("ArrowDown");
    await expect(page.locator(`${content} [role="menuitem"]`).first()).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await expect(page.locator(`${content} [role="menuitem"]`).last()).toBeFocused();
  });

  test("Escape cierra y devuelve el foco al disparador", async ({ page }) => {
    const btn = page.locator(trigger);
    await btn.click();
    await expect(page.locator(content)).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.locator(content)).toBeHidden();
    await expect(btn).toBeFocused();
  });

  test("los ítems siguen siendo enlaces de verdad", async ({ page }) => {
    await page.locator(trigger).click();

    const linkedin = page.locator(`${content} [role="menuitem"]`).first();
    await expect(linkedin).toHaveJSProperty("tagName", "A");
    await expect(linkedin).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/siete3/"
    );
    await expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
  });

  // El runtime hace preventDefault() sobre Enter para emitir su propio
  // `select`, así que sin el listener de SocialProfileMenu el menú se cerraría
  // sin abrir el enlace.
  test("Enter sobre un ítem abre su enlace", async ({ page, context }) => {
    await context.route("https://www.linkedin.com/**", (route) =>
      route.fulfill({ status: 200, body: "ok" })
    );

    await page.locator(trigger).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown");

    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      page.keyboard.press("Enter"),
    ]);

    expect(popup.url()).toBe("https://www.linkedin.com/in/siete3/");
  });
});
