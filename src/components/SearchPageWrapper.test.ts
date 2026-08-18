// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByText } from "@testing-library/dom";
import SearchPageWrapper from "./SearchPageWrapper.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("SearchPageWrapper", () => {
  test("renders with default structure", async () => {
    const result = await renderAstroComponent(SearchPageWrapper, {
      slots: {
        title: "Resultados de búsqueda",
      },
    });

    const container = result.querySelector("div");
    expect(container).not.toBeNull();
    expect(container?.classList.contains("max-w-5xl")).toBe(true);
    expect(container?.classList.contains("mx-auto")).toBe(true);
    expect(container?.classList.contains("px-4")).toBe(true);
    expect(container?.classList.contains("py-8")).toBe(true);
  });

  test("renders title slot", async () => {
    const result = await renderAstroComponent(SearchPageWrapper, {
      slots: {
        title: "Búsqueda personalizada",
      },
    });

    const title = getByText(result, "Búsqueda personalizada");
    expect(title).not.toBeNull();
    expect(title?.tagName).toBe("H2");
    expect(title?.classList.contains("text-3xl")).toBe(true);
    expect(title?.classList.contains("font-bold")).toBe(true);
    expect(title?.classList.contains("text-foreground")).toBe(true);
  });

  test("renders simplified search message", async () => {
    const result = await renderAstroComponent(SearchPageWrapper, {
      slots: {
        title: "Resultados",
      },
    });

    const simplifiedMessage = getByText(
      result,
      "Función de búsqueda temporalmente simplificada"
    );
    expect(simplifiedMessage).not.toBeNull();
    expect(simplifiedMessage?.classList.contains("text-muted-foreground")).toBe(
      true
    );
  });

  test("has correct layout structure", async () => {
    const result = await renderAstroComponent(SearchPageWrapper, {
      slots: {
        title: "Resultados",
      },
    });

    // Verificar estructura del layout
    const mainContainer = result.querySelector("div");
    expect(mainContainer).not.toBeNull();

    const headerSection = mainContainer?.querySelector("div");
    expect(headerSection).not.toBeNull();
    expect(headerSection?.classList.contains("mb-8")).toBe(true);

    const contentSection = mainContainer?.querySelectorAll("div")[1];
    expect(contentSection).not.toBeNull();
    expect(contentSection?.classList.contains("text-center")).toBe(true);
    expect(contentSection?.classList.contains("py-12")).toBe(true);
  });

  test("renders with empty title slot", async () => {
    const result = await renderAstroComponent(SearchPageWrapper, {
      slots: {
        title: "",
      },
    });

    const h2 = result.querySelector("h2");
    expect(h2).not.toBeNull();
    expect(h2?.textContent?.trim()).toBe("");
  });

  test("renders with special characters in title", async () => {
    const result = await renderAstroComponent(SearchPageWrapper, {
      slots: {
        title: "Búsqueda & Resultados",
      },
    });

    const title = getByText(result, "Búsqueda & Resultados");
    expect(title).not.toBeNull();
  });

  test("has correct spacing classes", async () => {
    const result = await renderAstroComponent(SearchPageWrapper, {
      slots: {
        title: "Resultados",
      },
    });

    const mainContainer = result.querySelector("div");
    expect(mainContainer?.classList.contains("max-w-5xl")).toBe(true);
    expect(mainContainer?.classList.contains("mx-auto")).toBe(true);
    expect(mainContainer?.classList.contains("px-4")).toBe(true);
    expect(mainContainer?.classList.contains("py-8")).toBe(true);

    const headerSection = mainContainer?.querySelector("div");
    expect(headerSection?.classList.contains("mb-8")).toBe(true);

    const title = headerSection?.querySelector("h2");
    expect(title?.classList.contains("mb-2")).toBe(true);
  });

  test("renders with paragraph for search message", async () => {
    const result = await renderAstroComponent(SearchPageWrapper, {
      slots: {
        title: "Resultados",
      },
    });

    // Verificar que existe el párrafo para el mensaje de búsqueda
    const paragraphs = result.querySelectorAll("p");
    expect(paragraphs.length).toBeGreaterThan(0);

    // El primer párrafo debería tener la clase text-muted-foreground
    const firstParagraph = paragraphs[0];
    expect(firstParagraph?.classList.contains("text-muted-foreground")).toBe(
      true
    );
  });

  test("renders with correct text content structure", async () => {
    const result = await renderAstroComponent(SearchPageWrapper, {
      slots: {
        title: "Resultados",
      },
    });

    // Verificar que el contenido de texto está presente
    expect(result.textContent).toContain("Resultados");
    expect(result.textContent).toContain(
      "Función de búsqueda temporalmente simplificada"
    );
  });

  test("has proper container hierarchy", async () => {
    const result = await renderAstroComponent(SearchPageWrapper, {
      slots: {
        title: "Resultados",
      },
    });

    const mainContainer = result.querySelector("div");
    const childDivs = mainContainer?.querySelectorAll("div");

    expect(childDivs?.length).toBe(2);

    // Primer div (header)
    expect(childDivs?.[0]?.classList.contains("mb-8")).toBe(true);

    // Segundo div (content)
    expect(childDivs?.[1]?.classList.contains("text-center")).toBe(true);
    expect(childDivs?.[1]?.classList.contains("py-12")).toBe(true);
  });
});
