import { test, expect } from "@playwright/test";

// Los tres feeds estuvieron 404 en producción sin que nadie lo notara: el
// <head> anunciaba /rss.xml, /en/rss.xml y /feed.xml, pero los ficheros son
// `rss.js` y `feed.js`, así que las rutas reales son /rss, /en/rss y /feed. Un
// enlace roto en un `<link rel="alternate">` no se ve navegando: solo lo
// descubre quien intenta suscribirse.
//
// Por eso el test no comprueba una URL escrita a mano —volvería a pasar lo
// mismo— sino las que el sitio anuncia de verdad.
test("las tres alternates del <head> sirven un feed", async ({
  page,
  request,
}) => {
  await page.goto("/es");

  const hrefs = await page
    .locator('link[rel="alternate"][type="application/rss+xml"]')
    .evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href));

  expect(hrefs).toHaveLength(3);

  for (const href of hrefs) {
    // BaseHead las construye contra `site`, que es el dominio de producción;
    // aquí interesa la misma ruta contra el servidor bajo prueba.
    const { pathname } = new URL(href);
    const response = await request.get(pathname);

    expect(response.status(), `${pathname} debería servir el feed`).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");
    expect(await response.text()).toContain("<rss");
  }
});
