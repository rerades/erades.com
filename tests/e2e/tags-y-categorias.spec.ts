import { test, expect } from "@playwright/test";

test.describe("Tags y Categorías", () => {
  test("navegar a la página de tags y verificar estructura", async ({
    page,
  }) => {
    // Ir a la página de tags en español
    await page.goto("/es/tags");

    // Verificar que la URL es correcta
    expect(page.url()).toMatch(/\/es\/tags/);

    // Verificar que el título principal es visible
    const mainTitle = page
      .locator("h2")
      .filter({ hasText: /(Tags y Categorías|Todos los Posts|All Posts)/ });
    await expect(mainTitle).toBeVisible();
    const mainTitleText = await mainTitle.textContent();
    expect(mainTitleText).toBeTruthy();
    expect(mainTitleText!.trim().length).toBeGreaterThan(0);

    // Verificar que las secciones principales están presentes
    await expect(page.getByText("Nube de Etiquetas")).toBeVisible();
    await expect(page.getByText("Etiquetas Populares")).toBeVisible();
    await expect(page.getByText("Tendencias")).toBeVisible();
    await expect(page.getByText("Etiquetas Recientes")).toBeVisible();
  });

  test("verificar enlaces de la Nube de Etiquetas", async ({ page }) => {
    // Ir a la página de tags
    await page.goto("/es/tags");

    // Esperar a que la sección de Nube de Etiquetas esté visible
    await expect(page.getByText("Nube de Etiquetas")).toBeVisible();

    // Obtener el primer enlace de la nube de etiquetas usando el contenedor específico
    const tagCloudContainer = page.locator(
      '[role="region"][aria-label="nube de etiquetas"]'
    );
    await expect(tagCloudContainer).toBeVisible();

    const firstLink = tagCloudContainer.locator('a[href*="/tags/"]').first();
    await expect(firstLink).toBeVisible();

    const linkText = await firstLink.locator("span[aria-label]").textContent();
    const linkHref = await firstLink.getAttribute("href");

    expect(linkText).toBeTruthy();
    expect(linkHref).toBeTruthy();

    // Hacer clic en el enlace
    await firstLink.click();
    // Verificar que la URL contiene el nombre del tag
    const tagName = linkText!.replace(/#/g, "").replace(/\s+/g, "").trim();
    const encodedTag = encodeURIComponent(tagName);
    console.log("encodedTag:: ", encodedTag);
    await page.waitForURL(`/es/tags/${encodedTag}/`);
    expect(page.url()).toMatch(`/es/tags/${encodedTag}/`);
    const categoryHrefs = await page.locator("#filters a").evaluateAll((els) =>
      els.map((el) => el.getAttribute("href") ?? "")
    );
    expect(categoryHrefs.length).toBeGreaterThan(0);
    for (const href of categoryHrefs) {
      expect(href.startsWith("/es/tags/")).toBe(true);
      expect(href.startsWith("/tags/")).toBe(false);
    }
    // Verificar que la página de tag individual muestra posts (si existen)
    const blogPosts = page.locator(
      '[aria-label="grid-card"], [aria-label="list-card"]'
    );
    const postCount = await blogPosts.count();

    // Si hay posts, verificar que el título contiene "Todos los Posts"
    if (postCount > 0) {
      // Verificar que el título de la página contiene el tag
      const pageTitle = page
        .locator("h1, h2")
        .filter({ hasText: /Tags|Posts|Todos/ });
      await expect(pageTitle).toBeVisible();
      const titleText = await pageTitle.textContent();
      expect(titleText).toContain("Todos los Posts");
    } else {
      // Si no hay posts, simplemente verificar que la página existe y tiene un título
      const pageTitle = page
        .locator("h1, h2")
        .filter({ hasText: /Tags|Posts|Todos/ });
      await expect(pageTitle).toBeVisible();
    }
  });

  test("verificar enlaces de Etiquetas Populares", async ({ page }) => {
    // Ir a la página de tags
    await page.goto("/es/tags");

    // Esperar a que la sección de Etiquetas Populares esté visible
    await expect(page.getByText("Etiquetas Populares")).toBeVisible();

    // Obtener el primer enlace de etiquetas populares usando el contenedor específico
    const popularContainer = page.locator(
      '[role="region"][aria-label="etiquetas populares"]'
    );
    await expect(popularContainer).toBeVisible();

    const firstLink = popularContainer.locator('a[href*="/tags/"]').first();
    await expect(firstLink).toBeVisible();

    const linkText = await firstLink.locator("span[aria-label]").textContent();
    const linkHref = await firstLink.getAttribute("href");

    expect(linkText).toBeTruthy();
    expect(linkHref).toBeTruthy();

    // Extraer el nombre del tag del texto del enlace (eliminar # y espacios)
    const tagName = linkText!.replace(/#/g, "").replace(/\s+/g, "").trim();

    console.log("LinkText original:", linkText);
    console.log("TagName extraído:", tagName);

    // Hacer clic en el enlace
    await firstLink.click();

    // Verificar que la URL contiene el nombre del tag
    await page.waitForURL(
      new RegExp(`/es/tags/${encodeURIComponent(tagName)}/`)
    );
    expect(page.url()).toMatch(
      new RegExp(`/es/tags/${encodeURIComponent(tagName)}/`)
    );

    // Verificar que la página de tag individual muestra posts (si existen)
    const blogPosts = page.locator(
      '[aria-label="grid-card"], [aria-label="list-card"]'
    );
    const postCount = await blogPosts.count();

    // Si hay posts, verificar que el título contiene "Todos los Posts"
    if (postCount > 0) {
      // Verificar que el título de la página contiene el tag
      const pageTitle = page
        .locator("h1, h2")
        .filter({ hasText: /Tags|Posts|Todos/ });
      await expect(pageTitle).toBeVisible();
      const titleText = await pageTitle.textContent();
      expect(titleText).toContain("Todos los Posts");
    } else {
      // Si no hay posts, simplemente verificar que la página existe y tiene un título
      const pageTitle = page
        .locator("h1, h2")
        .filter({ hasText: /Tags|Posts|Todos/ });
      await expect(pageTitle).toBeVisible();
    }
  });

  test("verificar enlaces de Tendencias", async ({ page }) => {
    // Ir a la página de tags
    await page.goto("/es/tags");

    // Esperar a que la sección de Tendencias esté visible
    await expect(page.getByText("Tendencias")).toBeVisible();

    // Obtener el primer enlace de tendencias usando el contenedor específico
    const trendingContainer = page.locator(
      '[role="region"][aria-label="tendencias"]'
    );
    await expect(trendingContainer).toBeVisible();

    const firstLink = trendingContainer.locator('a[href*="/tags/"]').first();
    await expect(firstLink).toBeVisible();

    const linkText = await firstLink.locator("span[aria-label]").textContent();
    const linkHref = await firstLink.getAttribute("href");

    expect(linkText).toBeTruthy();
    expect(linkHref).toBeTruthy();

    // Extraer el nombre del tag del texto del enlace (eliminar # y espacios)
    const tagName = linkText!.replace(/#/g, "").replace(/\s+/g, "").trim();

    console.log("LinkText original:", linkText);
    console.log("TagName extraído:", tagName);

    // Hacer clic en el enlace
    await firstLink.click();

    // Verificar que la URL contiene el nombre del tag
    await page.waitForURL(
      new RegExp(`/es/tags/${encodeURIComponent(tagName)}/`)
    );
    expect(page.url()).toMatch(
      new RegExp(`/es/tags/${encodeURIComponent(tagName)}/`)
    );

    // Verificar que la página de tag individual muestra posts (si existen)
    const blogPosts = page.locator(
      '[aria-label="grid-card"], [aria-label="list-card"]'
    );
    const postCount = await blogPosts.count();

    // Si hay posts, verificar que el título contiene "Todos los Posts"
    if (postCount > 0) {
      // Verificar que el título de la página contiene el tag
      const pageTitle = page
        .locator("h1, h2")
        .filter({ hasText: /Tags|Posts|Todos/ });
      await expect(pageTitle).toBeVisible();
      const titleText = await pageTitle.textContent();
      expect(titleText).toContain("Todos los Posts");
    } else {
      // Si no hay posts, simplemente verificar que la página existe y tiene un título
      const pageTitle = page
        .locator("h1, h2")
        .filter({ hasText: /Tags|Posts|Todos/ });
      await expect(pageTitle).toBeVisible();
    }
  });

  test("verificar enlaces de Etiquetas Recientes", async ({ page }) => {
    // Ir a la página de tags
    await page.goto("/es/tags");

    // Esperar a que la sección de Etiquetas Recientes esté visible
    await expect(page.getByText("Etiquetas Recientes")).toBeVisible();

    // Obtener el primer enlace de etiquetas recientes usando el contenedor específico
    const recentContainer = page.locator(
      '[role="region"][aria-label="etiquetas recientes"]'
    );
    await expect(recentContainer).toBeVisible();

    const firstLink = recentContainer.locator('a[href*="/tags/"]').first();
    await expect(firstLink).toBeVisible();

    const linkText = await firstLink.locator("span[aria-label]").textContent();
    const linkHref = await firstLink.getAttribute("href");

    expect(linkText).toBeTruthy();
    expect(linkHref).toBeTruthy();

    // Extraer el nombre del tag del texto del enlace (eliminar # y espacios)
    const tagName = linkText!.replace(/#/g, "").replace(/\s+/g, "").trim();

    console.log("LinkText original:", linkText);
    console.log("TagName extraído:", tagName);

    // Hacer clic en el enlace
    await firstLink.click();

    // Verificar que la URL contiene el nombre del tag
    await page.waitForURL(
      new RegExp(`/es/tags/${encodeURIComponent(tagName)}/`)
    );
    expect(page.url()).toMatch(
      new RegExp(`/es/tags/${encodeURIComponent(tagName)}/`)
    );

    // Verificar que la página de tag individual muestra posts (si existen)
    const blogPosts = page.locator(
      '[aria-label="grid-card"], [aria-label="list-card"]'
    );
    const postCount = await blogPosts.count();

    // Si hay posts, verificar que el título contiene "Todos los Posts"
    if (postCount > 0) {
      // Verificar que el título de la página contiene el tag
      const pageTitle = page
        .locator("h1, h2")
        .filter({ hasText: /Tags|Posts|Todos/ });
      await expect(pageTitle).toBeVisible();
      const titleText = await pageTitle.textContent();
      expect(titleText).toContain("Todos los Posts");
    } else {
      // Si no hay posts, simplemente verificar que la página existe y tiene un título
      const pageTitle = page
        .locator("h1, h2")
        .filter({ hasText: /Tags|Posts|Todos/ });
      await expect(pageTitle).toBeVisible();
    }
  });

  test("verificar que las estadísticas muestran información correcta", async ({
    page,
  }) => {
    // Ir a la página de tags
    await page.goto("/es/tags");

    // Verificar que la sección de estadísticas está presente
    await expect(page.getByText("Estadísticas")).toBeVisible();

    // Obtener el contenedor de estadísticas usando el aria-label
    const statsContainer = page.locator(
      '[role="region"][aria-label="estadísticas"]'
    );
    await expect(statsContainer).toBeVisible();

    // Verificar que muestra el total de etiquetas
    const totalTagsText = statsContainer.locator(
      'div:has-text("Total etiquetas:")'
    );
    await expect(totalTagsText).toBeVisible();

    // Verificar que muestra el total de posts etiquetados
    const totalPostsText = statsContainer.locator(
      'div:has-text("Posts etiquetados:")'
    );
    await expect(totalPostsText).toBeVisible();

    // Verificar que muestra las etiquetas en tendencia
    const trendingText = statsContainer.locator(
      'div:has-text("En tendencia:")'
    );
    await expect(trendingText).toBeVisible();

    // Verificar que los números son mayores que 0
    const totalTagsValue = statsContainer.locator(
      'div:has-text("Total etiquetas:") [aria-label="quantity"]'
    );
    const totalPostsValue = statsContainer.locator(
      'div:has-text("Posts etiquetados:") [aria-label="quantity"]'
    );
    const trendingValue = statsContainer.locator(
      'div:has-text("En tendencia:") [aria-label="quantity"]'
    );

    await expect(totalTagsValue).toBeVisible();
    await expect(totalPostsValue).toBeVisible();
    await expect(trendingValue).toBeVisible();

    const totalTags = await totalTagsValue.textContent();
    const totalPosts = await totalPostsValue.textContent();
    const trending = await trendingValue.textContent();

    expect(parseInt(totalTags!)).toBeGreaterThan(0);
    expect(parseInt(totalPosts!)).toBeGreaterThan(0);
    expect(parseInt(trending!)).toBeGreaterThan(0);
  });
});
