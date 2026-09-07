import { expect, test } from "@playwright/test";

test("los posts en draft no se sirven en la URL de detalle", async ({
  request,
}) => {
  const response = await request.get("/es/blog/functional/monads/");
  expect(response.status()).toBe(404);
});

test("el índice público y la API de búsqueda no exponen drafts", async ({
  request,
}) => {
  const indexResponse = await request.get("/search-index.json");
  expect(indexResponse.status()).toBe(200);
  const docs: { readonly id: string; readonly draft?: boolean }[] =
    await indexResponse.json();
  expect(docs.some((doc) => doc.draft === true)).toBe(false);
  expect(docs.some((doc) => doc.id === "es/functional/monads")).toBe(false);

  const searchResponse = await request.get("/api/search?q=monadas");
  expect(searchResponse.status()).toBe(200);
  const results: { readonly id: string }[] = await searchResponse.json();
  expect(results.some((doc) => doc.id === "es/functional/monads")).toBe(false);
});
