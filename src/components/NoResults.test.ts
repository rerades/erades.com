// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByText, getByRole } from "@testing-library/dom";
import NoResults from "./NoResults.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("NoResults", () => {
  test("renders no results message", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {},
    });

    const title = getByText(result, "No se encontraron resultados");
    expect(title).not.toBeNull();
  });

  test("renders suggestion text", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {},
    });

    const suggestion = getByText(
      result,
      "Intenta con otros términos de búsqueda o cambia los filtros."
    );
    expect(suggestion).not.toBeNull();
  });

  test("renders reset link with default href", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {},
    });

    const link = getByRole(result, "link");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe("?category=all");
    expect(link?.textContent?.trim()).toBe("Ver todos los posts");
  });

  test("renders reset link with custom href", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {
        onResetHref: "/custom-reset",
      },
    });

    const link = getByRole(result, "link");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe("/custom-reset");
  });

  test("renders search icon", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {},
    });

    const icon = result.querySelector("svg");
    expect(icon).not.toBeNull();
  });

  // Los textos estaban escritos en espanol dentro del componente, asi que en
  // /en/search salia media pagina en el idioma equivocado. Estos dos casos son
  // los que fallan si alguien vuelve a incrustarlos.
  test("traduce los textos con lang=en", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: { lang: "en" },
    });

    expect(getByText(result, "No results found")).not.toBeNull();
    expect(
      getByText(result, "Try other search terms or change the filters.")
    ).not.toBeNull();
    expect(getByRole(result, "link").textContent?.trim()).toBe("See all posts");
  });

  test("sin lang cae en espanol", async () => {
    const result = await renderAstroComponent(NoResults, { props: {} });

    expect(getByText(result, "No se encontraron resultados")).not.toBeNull();
  });

  test("renders title with correct classes", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {},
    });

    const title = getByText(result, "No se encontraron resultados");
    const classes = title?.getAttribute("class");
    expect(classes).toContain("font-serif");
    expect(classes).toContain("text-xl");
    expect(classes).toContain("font-semibold");
  });

  test("renders link with correct classes", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {},
    });

    const link = getByRole(result, "link");
    const classes = link?.getAttribute("class");
    expect(classes).toContain("px-4");
    expect(classes).toContain("py-2");
    expect(classes).toContain("rounded-md");
  });

  test("renders icon with correct classes", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {},
    });

    const icon = result.querySelector("svg");
    const classes = icon?.getAttribute("class");
    expect(classes).toContain("mx-auto");
    expect(classes).toContain("mb-4");
    expect(classes).toContain("text-muted-foreground");
  });

  test("renders suggestion with correct classes", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {},
    });

    const suggestion = getByText(
      result,
      "Intenta con otros términos de búsqueda o cambia los filtros."
    );
    const classes = suggestion?.getAttribute("class");
    expect(classes).toContain("text-muted-foreground");
    expect(classes).toContain("mb-6");
  });
});
