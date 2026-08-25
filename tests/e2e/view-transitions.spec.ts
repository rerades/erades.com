import { test, expect, type Page } from "@playwright/test";

/**
 * Las animaciones en sí no se pueden afirmar desde aquí, pero sí lo que las
 * decide: el tipo (`forward`/`back`) que `ViewTransitions.astro` añade a la
 * transición activa, y el `view-transition-name` que marca el título pulsado.
 */

interface SwapRecord {
  readonly from: string;
  readonly to: string;
  readonly types: readonly string[];
}

/**
 * Registra en `sessionStorage` los tipos de cada transición entre documentos.
 * Se instala con `addInitScript` para estar presente en todos los documentos,
 * y lee los tipos en un `setTimeout` porque este listener se registra antes
 * que el de la propia página, que es quien los añade.
 */
const installTransitionProbe = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    window.addEventListener("pageswap", (event) => {
      const swap = event as PageSwapEvent;
      if (!swap.viewTransition) return;

      const log = JSON.parse(sessionStorage.getItem("vt-probe") ?? "[]");
      log.push({
        from: new URL(swap.activation!.from!.url!).pathname,
        to: new URL(swap.activation!.entry.url!).pathname,
        types: [],
      });
      sessionStorage.setItem("vt-probe", JSON.stringify(log));

      setTimeout(() => {
        const stored = JSON.parse(sessionStorage.getItem("vt-probe") ?? "[]");
        stored[stored.length - 1].types = [...swap.viewTransition!.types];
        sessionStorage.setItem("vt-probe", JSON.stringify(stored));
      }, 0);
    });
  });
};

const readProbe = (page: Page): Promise<SwapRecord[]> =>
  page.evaluate(() => JSON.parse(sessionStorage.getItem("vt-probe") ?? "[]"));

test.describe("View transitions", () => {
  test("la dirección sigue al paginador, no al índice del historial", async ({
    page,
  }) => {
    await installTransitionProbe(page);
    await page.goto("/es/blog");

    await page.click('a[href*="/blog/page/2"]');
    await page.waitForURL(/page\/2/);
    await page.click('a[href*="/blog/page/3"]');
    await page.waitForURL(/page\/3/);
    // "Anterior" es un `push`: el índice del historial sube, pero para el
    // lector es ir hacia atrás. Es el caso que distingue las dos heurísticas.
    await page.click('a[href*="/blog/page/2"]');
    await page.waitForURL(/page\/2/);

    const swaps = await readProbe(page);
    expect(swaps.map((swap) => swap.types[0])).toEqual([
      "forward",
      "forward",
      "back",
    ]);
  });

  test("solo el título de la tarjeta pulsada recibe el nombre compartido", async ({
    page,
  }) => {
    await page.goto("/es/blog");

    const titles = page.locator('[aria-label="blog-card-title"]');
    await titles.first().waitFor();
    await page
      .locator('a[aria-label$="-card"]')
      .first()
      .dispatchEvent("pointerdown");

    const named = await titles.evaluateAll((elements) =>
      elements
        .map((element) => (element as HTMLElement).style.viewTransitionName)
        .filter(Boolean),
    );
    expect(named).toEqual(["post-title"]);

    await page.locator('a[aria-label$="-card"]').first().click();
    await expect(page.locator('[data-testid="post-title"]')).toHaveCSS(
      "view-transition-name",
      "post-title",
    );
  });
});
