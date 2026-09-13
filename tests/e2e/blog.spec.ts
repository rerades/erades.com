import { test, expect } from "@playwright/test";
import {
  setupPageForVisualTest,
  waitForPageReady,
} from "../visual-regression/visual-helpers";

test.describe("Blog", () => {
  test.beforeEach(async ({ page }) => {
    await setupPageForVisualTest(page);
  });
  test("navegar al blog y comprobar que se ven los posts y tiene un título", async ({
    page,
  }) => {
    // Ir a la página principal en español
    await page.goto("/es");
    await waitForPageReady(page);

    // Hacer clic en el enlace de "Blog" del header
    // (el footer tiene otro enlace a /blog con el mismo nombre accesible)
    const blogLink = page
      .getByLabel("header")
      .getByRole("link", { name: "Blog" });
    await blogLink.click();

    // Esperar a que la URL cambie a la página del blog
    await page.waitForURL(/\/es\/blog/);
    await waitForPageReady(page);
    expect(page.url()).toMatch(/\/es\/blog/);

    // Comprobar que el título principal del blog es visible y no vacío
    const mainTitle = page
      .locator("h2")
      .filter({ hasText: /(Todos los Posts|All Posts)/ });
    await expect(mainTitle).toBeVisible();
    const mainTitleText = await mainTitle.textContent();
    expect(mainTitleText).toBeTruthy();
    expect(mainTitleText!.trim().length).toBeGreaterThan(0);

    // Comprobar que los blogposts estén visibles
    const blogPosts = page.locator('[aria-label="grid-card"]');
    const blogPostCount = await blogPosts.count();
    expect(blogPostCount).toBeGreaterThan(0);

    // Comprobar que todos los posts tienen título visible y no vacío
    const postTitles = blogPosts.locator('[aria-label="blog-card-title"]');
    const titleCount = await postTitles.count();
    expect(titleCount).toBeGreaterThan(0);

    for (let i = 0; i < titleCount; i++) {
      const title = postTitles.nth(i);
      await expect(title).toBeVisible();
      const text = await title.textContent();
      expect(text).toBeTruthy();
      expect(text!.trim().length).toBeGreaterThan(0);
    }
  });

  test("ordenar por título muestra los posts en orden alfabético", async ({
    page,
  }) => {
    // Ir a la página de búsqueda con una query que devuelva varios posts
    await page.goto("/es/blog");
    await waitForPageReady(page);

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

    // Esperar al cambio de estado real, no a que un título concreto cambie:
    // esa espera era flaky (dependía de una ventana de 5s) y además asumía que
    // el primer post por fecha nunca coincide con el primero alfabéticamente.
    await page.waitForURL(/sortBy=title/);
    await waitForPageReady(page);
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
    // Ir a la página del blog
    await page.goto("/es/blog");
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
    await page.goto("/es/blog");

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

  test("navegar a la página 2 del paginador cambia los posts", async ({
    page,
  }) => {
    // Ir a la página del blog
    await page.goto("/es/blog");

    // Esperar a que los blogposts estén visibles
    const blogPosts = page.locator('[aria-label="posts-list"]');
    await expect(blogPosts).toBeVisible();

    // Obtener los títulos de los posts de la primera página
    const getTitles = async () => {
      return await blogPosts
        .locator('[aria-label="blog-card-title"]')
        .allTextContents();
    };
    const titlesPage1 = await getTitles();

    // Verificar que el paginador está visible (usar el primero)
    const paginator = page
      .locator('nav[aria-label="Navegación de páginas"]')
      .first();
    await expect(paginator).toBeVisible();

    // Hacer clic en el enlace de la página 2
    const page2Link = page.getByRole("link", { name: "Ir a página 2" }).first();
    await page2Link.click();

    // Esperar a que la URL cambie a la página 2
    await page.waitForURL(/\/es\/blog\/page\/2/);

    // Esperar un poco más para asegurar que el contenido se carga
    await page.waitForTimeout(1000);

    // Obtener los títulos de los posts de la segunda página
    const titlesPage2 = await getTitles();

    // Comprobar que los posts han cambiado
    expect(titlesPage2).not.toEqual(titlesPage1);

    // Comprobar que estamos en la página 2 (el enlace de página 2 debería estar activo)
    const activePage2 = page
      .locator('nav[aria-label="Navegación de páginas"]')
      .first()
      .locator('[aria-current="page"]')
      .first();
    await expect(activePage2).toHaveText("2");
  });

  test("el botón Anterior está deshabilitado en la primera página", async ({
    page,
  }) => {
    // Ir a la página del blog (primera página)
    await page.goto("/es/blog");

    // Esperar a que el paginador esté visible
    const paginator = page
      .locator('nav[aria-label="Navegación de páginas"]')
      .first();
    await expect(paginator).toBeVisible();

    // Comprobar que el botón "Anterior" está deshabilitado
    const prevButton = page
      .locator('[aria-label="Anterior (página no disponible)"]')
      .first();
    await expect(prevButton).toBeVisible();
    await expect(prevButton).toHaveAttribute("aria-disabled", "true");

    // Comprobar que tiene la clase de opacidad reducida
    await expect(prevButton).toHaveClass(/opacity-50/);
  });

  test("navegar a la última página deshabilita el botón Siguiente", async ({
    page,
  }) => {
    // Ir a la página del blog
    await page.goto("/es/blog");

    // Esperar a que el paginador esté visible
    const paginator = page
      .locator('nav[aria-label="Navegación de páginas"]')
      .first();
    await expect(paginator).toBeVisible();

    // Obtener el número total de páginas
    const pageLinks = page.locator(
      'nav[aria-label="Navegación de páginas"] a[aria-label*="Ir a página"]'
    );
    const pageNumbers = await pageLinks.allTextContents();
    const lastPageNumber = Math.max(
      ...pageNumbers.map((num) => parseInt(num, 10))
    );

    // Hacer clic en el enlace de la última página
    const lastPageLink = page
      .getByRole("link", {
        name: `Ir a página ${lastPageNumber}`,
      })
      .first();
    await lastPageLink.click();

    // Esperar a que la URL cambie a la última página
    await page.waitForURL(new RegExp(`/es/blog/page/${lastPageNumber}`));

    // Asegurar que el contenido de la última página está listo
    await waitForPageReady(page);
    // Obtener los títulos de los posts de la última página
    const blogPosts = page.locator('[aria-label="grid-card"]');
    const getTitles = async () => {
      return await blogPosts
        .locator('[aria-label="blog-card-title"]')
        .allTextContents();
    };
    const titlesLastPage = await getTitles();

    // Comprobar que el botón "Siguiente" está deshabilitado
    const nextButton = page
      .locator('[aria-label="Siguiente (página no disponible)"]')
      .first();
    await expect(nextButton).toBeVisible();
    await expect(nextButton).toHaveAttribute("aria-disabled", "true");

    // Comprobar que tiene la clase de opacidad reducida
    await expect(nextButton).toHaveClass(/opacity-50/);

    // Comprobar que estamos en la última página (el enlace de la última página debería estar activo)
    const activeLastPage = page
      .locator('nav[aria-label="Navegación de páginas"] [aria-current="page"]')
      .first();
    await expect(activeLastPage).toHaveText(lastPageNumber.toString());
  });

  test("filtrar por AI desde la página 2 no deja el listado vacío", async ({
    page,
  }) => {
    await page.goto("/es/blog/page/2");
    await waitForPageReady(page);

    const aiChip = page.getByRole("link", { name: "AI", exact: true }).first();
    await aiChip.click();

    await page.waitForURL(/[?&]category=AI(?:&|$)/);
    await waitForPageReady(page);

    const blogPosts = page.locator('[aria-label="grid-card"]');
    expect(await blogPosts.count()).toBeGreaterThan(0);
    expect(page.url()).not.toMatch(/[?&]category=ai(?:&|$)/);
  });
});
