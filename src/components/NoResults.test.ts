// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByText, getByRole } from "@testing-library/dom";
import NoResults from "./NoResults.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("NoResults", () => {
  test("renders no results message", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {
        query: "test search",
      },
    });

    const title = getByText(result, "No se encontraron resultados");
    expect(title).not.toBeNull();
  });

  test("renders suggestion text", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {
        query: "test search",
      },
    });

    const suggestion = getByText(
      result,
      "Intenta con otros términos de búsqueda o cambia los filtros."
    );
    expect(suggestion).not.toBeNull();
  });

  test("renders reset link with default href", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {
        query: "test search",
      },
    });

    const link = getByRole(result, "link");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe("?category=all");
    expect(link?.textContent?.trim()).toBe("Ver todos los posts");
  });

  test("renders reset link with custom href", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {
        query: "test search",
        onResetHref: "/custom-reset",
      },
    });

    const link = getByRole(result, "link");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe("/custom-reset");
  });

  test("renders search icon", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {
        query: "test search",
      },
    });

    const icon = result.querySelector("svg");
    expect(icon).not.toBeNull();
  });

  test("renders with empty query", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {
        query: "",
      },
    });

    const title = getByText(result, "No se encontraron resultados");
    expect(title).not.toBeNull();
  });

  test("renders with undefined query", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {},
    });

    const title = getByText(result, "No se encontraron resultados");
    expect(title).not.toBeNull();
  });

  test("renders title with correct classes", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {
        query: "test search",
      },
    });

    const title = getByText(result, "No se encontraron resultados");
    const classes = title?.getAttribute("class");
    expect(classes).toContain("font-serif");
    expect(classes).toContain("text-xl");
    expect(classes).toContain("font-semibold");
  });

  test("renders link with correct classes", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {
        query: "test search",
      },
    });

    const link = getByRole(result, "link");
    const classes = link?.getAttribute("class");
    expect(classes).toContain("px-4");
    expect(classes).toContain("py-2");
    expect(classes).toContain("rounded-md");
  });

  test("renders icon with correct classes", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {
        query: "test search",
      },
    });

    const icon = result.querySelector("svg");
    const classes = icon?.getAttribute("class");
    expect(classes).toContain("mx-auto");
    expect(classes).toContain("mb-4");
    expect(classes).toContain("text-muted-foreground");
  });

  test("renders suggestion with correct classes", async () => {
    const result = await renderAstroComponent(NoResults, {
      props: {
        query: "test search",
      },
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
