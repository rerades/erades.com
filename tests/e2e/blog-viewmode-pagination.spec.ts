import { test, expect } from "@playwright/test";

test.describe("Persistencia del modo de vista a través de la paginación", () => {
  test("mantiene la vista de lista al navegar a la página 2", async ({
    page,
  }) => {
    await page.goto("/es/blog");

    // Initial state: grid cards visible
    const gridCards = page.locator('[aria-label="grid-card"]');
    const initialGridCount = await gridCards.count();
    expect(initialGridCount).toBeGreaterThan(0);

    // Switch to list view using the toggle (anchor with title "Vista lista")
    const listViewToggle = page.locator('a[title="Vista lista"]').first();
    await Promise.all([
      page.waitForLoadState("networkidle"),
      listViewToggle.click(),
    ]);

    // Wait for list cards to appear and grid to disappear
    const listCards = page.locator('[aria-label="list-card"]');
    await page.waitForSelector('[aria-label="list-card"]');
    const listCount = await listCards.count();
    expect(listCount).toBeGreaterThan(0);
    await expect(gridCards).toHaveCount(0);

    // Click paginator page 2 (use first paginator instance)
    const page2Link = page.getByRole("link", { name: "Ir a página 2" }).first();
    await page2Link.click();

    // Ensure list still visible on page 2
    await page.waitForSelector('[aria-label="list-card"]');

    // Still in list view on page 2
    const listCountPage2 = await page
      .locator('[aria-label="list-card"]')
      .count();
    expect(listCountPage2).toBeGreaterThan(0);
    await expect(page.locator('[aria-label="grid-card"]')).toHaveCount(0);

    // Accessibility: page 2 should be current
    const activePage = page
      .locator('nav[aria-label="Navegación de páginas"] [aria-current="page"]')
      .first();
    await expect(activePage).toHaveText("2");
  });

  /**
   * Verifica que al cambiar al modo de vista "lista" en el blog,
   * navegar a la página 2 mediante la paginación mantiene el modo de vista seleccionado (list view)
   * y no regresa al modo grid. También comprueba que los elementos de accesibilidad
   * (aria-labels y aria-current) reflejan correctamente el estado de la paginación.
   */
  test("conserva viewMode, category y sortBy a través de la paginación", async ({
    page,
  }) => {
    await page.goto("/es/blog");

    // Switch to list view
    await Promise.all([
      page.waitForLoadState("networkidle"),
      page.locator('a[title="Vista lista"]').first().click(),
    ]);
    await page.waitForSelector('[aria-label="list-card"]');

    // Click a specific category chip if available and not already active
    const categoryChip = page.locator('a:has-text("Programación funcional")').first();
    if (await categoryChip.count()) {
      const isCurrent = await categoryChip.getAttribute("aria-current");
      if (isCurrent !== "page") {
        await Promise.all([
          page.waitForLoadState("networkidle"),
          categoryChip.click(),
        ]);
      }
    }

    // Change sort to title
    const sortSelect = page.locator('select[name="sortBy"]');
    await sortSelect.selectOption("title");

    // Ensure URL contains viewMode, possibly category and sortBy
    await expect(page).toHaveURL(/viewMode=list/);
    await expect(page).toHaveURL(/sortBy=title/);

    // Go to page 2
    await page.getByRole("link", { name: "Ir a página 2" }).first().click();

    // URL should still contain parameters
    await expect(page).toHaveURL(/\/es\/blog\/page\/2/);
    await expect(page).toHaveURL(/viewMode=list/);
    await expect(page).toHaveURL(/sortBy=title/);
    await expect(page).toHaveURL(/category=/);

    // Still list view
    await page.waitForSelector('[aria-label="list-card"]');
    const listCount = await page.locator('[aria-label="list-card"]').count();
    expect(listCount).toBeGreaterThan(0);
    await expect(page.locator('[aria-label="grid-card"]')).toHaveCount(0);
  });
});
