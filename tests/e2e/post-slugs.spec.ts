import { expect, test } from "@playwright/test";

test("el post inglés de renderizado condicional responde 200", async ({
  request,
}) => {
  const response = await request.get(
    "/en/blog/patterns/conditional-rendering-with-show/"
  );
  expect(response.status()).toBe(200);
});

test("las URLs viejas del .astro.mdx redirigen al slug canónico", async ({
  request,
}) => {
  // El fichero se llamaba `conditional-rendering-with-show.astro.mdx`.
  // El índice de búsqueda enlazaba con el `.astro`; Astro servía `showastro`.
  // Las dos tienen que llegar al post, no a un 404.
  for (const pathname of [
    "/en/blog/patterns/conditional-rendering-with-show.astro/",
    "/en/blog/patterns/conditional-rendering-with-showastro/",
  ]) {
    const response = await request.get(pathname);
    expect(response.status(), pathname).toBe(200);
    expect(response.url()).toContain(
      "/en/blog/patterns/conditional-rendering-with-show"
    );
  }
});

test("un resultado de búsqueda de ese post no 404ea", async ({ request }) => {
  const searchResponse = await request.get(
    "/api/search?q=Explicit%20Conditional%20Rendering"
  );
  expect(searchResponse.status()).toBe(200);

  const results: readonly { readonly id: string; readonly path: string }[] =
    await searchResponse.json();
  const hit = results.find(
    (doc) => doc.id === "en/patterns/conditional-rendering-with-show"
  );
  expect(hit).toBeDefined();

  const pageResponse = await request.get(`${hit?.path}/`);
  expect(pageResponse.status()).toBe(200);
});
