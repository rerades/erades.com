import { test, expect } from "@playwright/test";
import {
  setupPageForVisualTest,
  waitForPageReady,
} from "../visual-regression/visual-helpers";

test.describe("Buscador", () => {
  test.beforeEach(async ({ page }) => {
    await setupPageForVisualTest(page);
  });
  test("buscar 'func' y comprobar resultados", async ({ page }) => {
    // Ir a la home en español
    await page.goto("/es");

    // Establecer viewport de desktop para que el input de búsqueda esté visible
    await page.setViewportSize({ width: 1024, height: 768 });

    // Esperar a que la página cargue completamente
    await waitForPageReady(page);

    // Esperar a que el input de búsqueda esté visible (usar el visible, no el primero)
    const searchInputs = page.getByPlaceholder("Buscar en el blog...");
    const searchInput = searchInputs.filter({ hasText: "" }).nth(1); // Usar el segundo input que está visible
    await expect(searchInput).toBeVisible();

    // Escribir 'func' y presionar Enter
    await searchInput.fill("func");
    await searchInput.press("Enter");

    // Esperar la navegación a la página de resultados
    await page.waitForURL(/\/es\/search\?.*q=func/);
    expect(page.url()).toMatch(/\/es\/search\?.*q=func/);

    // Comprobar que aparece el texto de resultados
    // Ejemplo: Mostrando 2 de 2 resultados para func
    const resultsInfo = page.locator("text=Mostrando ");
    await expect(resultsInfo).toContainText(
      /Mostrando \d+ de \d+ resultados[\s\S]*func/
    );

    // Guardar el número total de resultados antes de filtrar
    const textBefore = await resultsInfo.textContent();
    const matchBefore =
      textBefore &&
      textBefore.match(/Mostrando \d+ de (\d+) resultados[\s\S]*func/);
    const totalBefore = matchBefore ? parseInt(matchBefore[1], 10) : null;

    // Hacer clic en la categoría 'design-patterns' (nombre visible desde i18n)
    const categoryLink = page
      .getByRole("link", { name: "Patrones de diseño", exact: true })
      .first();
    await categoryLink.click();

    // Esperar a que cambie el texto de resultados
    await expect(resultsInfo).not.toHaveText(textBefore ?? "");
    const textAfter = await resultsInfo.textContent();
    const matchAfter =
      textAfter &&
      textAfter.match(/Mostrando (\d+) de (\d+) resultados[\s\S]*func/);
    const shownAfter = matchAfter ? parseInt(matchAfter[1], 10) : null;
    const totalAfter = matchAfter ? parseInt(matchAfter[2], 10) : null;

    // Comprobar que el número de resultados es menor
    expect(totalAfter).not.toBeNull();
    expect(totalBefore).not.toBeNull();
    expect(totalAfter).toBeLessThan(totalBefore!);

    // Comprobar que el texto ha cambiado
    expect(textAfter).not.toBe(textBefore);

    // Comprobar que el número mostrado coincide con la cantidad de blogposts visibles
    const blogPosts = page.locator('[aria-label="grid-card"]');
    await expect(blogPosts).toHaveCount(shownAfter ?? 0);
  });

  test("ordenar por título muestra los posts en orden alfabético", async ({
    page,
  }) => {
    // Ir a la página de búsqueda con una query que devuelva varios posts
    await page.goto("/es/search?q=func");

    // Esperar a que los blogposts estén visibles
    const blogPosts = page.locator('[aria-label="grid-card"]');
    const count = await blogPosts.count();
    expect(count).toBeGreaterThan(1);

    // Obtener los títulos en el orden inicial
    const getTitles = async () => {
      return await blogPosts
        .locator('[aria-label="blog-card-title"]')
        .allTextContents();
    };
    const titlesBefore = await getTitles();

    // Seleccionar 'Por título' en el selector de orden
    const sortSelect = page.locator('select[name="sortBy"]');
    await sortSelect.selectOption("title");

    // Esperar a que el orden cambie de forma determinista: el primer título cambia
    await expect(
      blogPosts.locator('[aria-label="blog-card-title"]').first()
    ).not.toHaveText(titlesBefore[0] ?? "", { timeout: 5000 });
    const titlesAfter = await getTitles();

    // Comprobar que el orden ha cambiado
    expect(titlesAfter).not.toEqual(titlesBefore);

    // Comprobar que titlesAfter está ordenado alfabéticamente
    const sorted = [...titlesAfter].sort((a, b) => a.localeCompare(b));
    expect(titlesAfter).toEqual(sorted);
  });

  test("cambiar la vista de grid a list actualiza los aria-labels", async ({
    page,
  }) => {
    // Ir a la página de búsqueda con una query que devuelva varios posts
    await page.goto("/es/search?q=func");

    // Establecer viewport de desktop para que los controles estén visibles
    await page.setViewportSize({ width: 1024, height: 768 });

    // Esperar a que la página cargue completamente
    await waitForPageReady(page);

    // Esperar a que los blogposts en grid estén visibles
    const gridPosts = page.locator('[aria-label="grid-card"]');
    const gridCount = await gridPosts.count();
    expect(gridCount).toBeGreaterThan(0);

    // Comprobar que no hay posts con aria-label="list-card" inicialmente
    const listPostsInitial = page.locator('[aria-label="list-card"]');
    expect(await listPostsInitial.count()).toBe(0);

    // Cambiar a la vista de lista (list)
    // El componente ViewModeToggle usa enlaces con title
    const listViewButton = page.locator('a[title="Vista lista"]').first();
    await listViewButton.click();

    // Esperar a que la URL cambie para incluir viewMode=list
    await page.waitForURL(/viewMode=list/);

    // Esperar a que la página se recargue completamente
    await waitForPageReady(page);

    // Esperar a que los list-cards aparezcan antes de verificar que los grid-cards han desaparecido
    const listPosts = page.locator('[aria-label="list-card"]');
    await expect(listPosts).toHaveCount(gridCount, { timeout: 10000 });

    // Ahora verificar que los grid-cards han desaparecido
    // Usar un nuevo locator después del cambio de página para asegurar que se actualiza
    await expect(page.locator('[aria-label="grid-card"]')).toHaveCount(0);

    // Verificar que el número de list-cards coincide con el número original de grid-cards
    expect(await listPosts.count()).toBe(gridCount);
  });

  test("al hacer clic en un blogpost navega al detalle y el título coincide", async ({
    page,
  }) => {
    // Ir a la página de búsqueda con una query que devuelva varios posts
    await page.goto("/es/search?q=func");

    // Esperar a que los blogposts estén visibles
    const blogPosts = page.locator('[aria-label="grid-card"]');
    const count = await blogPosts.count();
    expect(count).toBeGreaterThan(0);

    // Seleccionar el primer blogpost y obtener su título
    const firstCard = blogPosts.first();
    const firstTitle = await firstCard
      .locator('[aria-label="blog-card-title"]')
      .textContent();

    // Hacer clic en el primer blogpost
    await firstCard.click();

    // Esperar a que la url cambie a la de detalle
    await page.waitForURL(/\/es\/blog\//);

    // Comprobar que el título de la página de detalle coincide
    const detailTitle = await page
      .locator('[data-testid="post-title"]')
      .textContent();
    expect(detailTitle?.trim()).toBe(firstTitle?.trim());
  });
});
