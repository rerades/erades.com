// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByText, getAllByText } from "@testing-library/dom";
import ResultsInfo from "./ResultsInfo.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("ResultsInfo", () => {
  test("renders basic results info without query", async () => {
    const result = await renderAstroComponent(ResultsInfo, {
      props: {
        shown: 5,
        total: 20,
      },
    });

    const paragraph = result.querySelector("p");
    expect(paragraph).not.toBeNull();
    expect(paragraph?.classList.contains("text-muted-foreground")).toBe(true);

    const shownSpan = getByText(result, "5");
    const totalSpan = getByText(result, "20");
    expect(shownSpan).not.toBeNull();
    expect(totalSpan).not.toBeNull();
    expect(shownSpan?.classList.contains("text-primary")).toBe(true);
    expect(totalSpan?.classList.contains("text-primary")).toBe(true);
  });

  test("renders results info with query", async () => {
    const result = await renderAstroComponent(ResultsInfo, {
      props: {
        shown: 3,
        total: 15,
        query: "javascript",
      },
    });

    const paragraph = result.querySelector("p");
    expect(paragraph).not.toBeNull();

    // Verificar que el texto contiene la información básica
    expect(result.textContent).toContain("Mostrando");
    expect(result.textContent).toContain("de");
    expect(result.textContent).toContain("resultados");

    // Verificar que contiene la query
    expect(result.textContent).toContain("javascript");
  });

  test("renders with zero results", async () => {
    const result = await renderAstroComponent(ResultsInfo, {
      props: {
        shown: 0,
        total: 0,
      },
    });

    const paragraph = result.querySelector("p");
    expect(paragraph).not.toBeNull();

    const zeroSpans = getAllByText(result, "0");
    expect(zeroSpans.length).toBe(2);
    expect(zeroSpans[0]?.classList.contains("text-primary")).toBe(true);
    expect(zeroSpans[1]?.classList.contains("text-primary")).toBe(true);
  });

  test("renders with single result", async () => {
    const result = await renderAstroComponent(ResultsInfo, {
      props: {
        shown: 1,
        total: 1,
      },
    });

    const paragraph = result.querySelector("p");
    expect(paragraph).not.toBeNull();

    const oneSpans = getAllByText(result, "1");
    expect(oneSpans.length).toBe(2);
    expect(oneSpans[0]?.classList.contains("text-primary")).toBe(true);
    expect(oneSpans[1]?.classList.contains("text-primary")).toBe(true);
  });

  test("renders with large numbers", async () => {
    const result = await renderAstroComponent(ResultsInfo, {
      props: {
        shown: 1000,
        total: 5000,
      },
    });

    const shownSpan = getByText(result, "1000");
    const totalSpan = getByText(result, "5000");
    expect(shownSpan).not.toBeNull();
    expect(totalSpan).not.toBeNull();
  });

  test("renders with query containing special characters", async () => {
    const result = await renderAstroComponent(ResultsInfo, {
      props: {
        shown: 2,
        total: 10,
        query: "react & typescript",
      },
    });

    expect(result.textContent).toContain("react & typescript");
  });

  test("renders with empty query string", async () => {
    const result = await renderAstroComponent(ResultsInfo, {
      props: {
        shown: 5,
        total: 20,
        query: "",
      },
    });

    const paragraph = result.querySelector("p");
    expect(paragraph).not.toBeNull();

    // No debería contener "para" cuando query está vacío
    expect(result.textContent).not.toContain("para");
  });

  test("renders with undefined query", async () => {
    const result = await renderAstroComponent(ResultsInfo, {
      props: {
        shown: 5,
        total: 20,
        query: undefined,
      },
    });

    const paragraph = result.querySelector("p");
    expect(paragraph).not.toBeNull();

    // No debería contener "para" cuando query es undefined
    expect(result.textContent).not.toContain("para");
  });

  test("has correct structure with query", async () => {
    const result = await renderAstroComponent(ResultsInfo, {
      props: {
        shown: 3,
        total: 8,
        query: "astro",
      },
    });

    // Verificar que la estructura es correcta
    const paragraph = result.querySelector("p");
    expect(paragraph).not.toBeNull();

    // Verificar que los spans con números tienen la clase correcta
    const spans = paragraph?.querySelectorAll("span");
    expect(spans?.length).toBeGreaterThan(0);

    // Verificar que al menos un span tiene la clase text-primary
    const primarySpans = paragraph?.querySelectorAll(".text-primary");
    expect(primarySpans?.length).toBeGreaterThan(0);
  });

  test("renders with shown greater than total", async () => {
    const result = await renderAstroComponent(ResultsInfo, {
      props: {
        shown: 10,
        total: 5,
      },
    });

    const shownSpan = getByText(result, "10");
    const totalSpan = getByText(result, "5");
    expect(shownSpan).not.toBeNull();
    expect(totalSpan).not.toBeNull();
  });

  test("renders with negative numbers", async () => {
    const result = await renderAstroComponent(ResultsInfo, {
      props: {
        shown: -1,
        total: -5,
      },
    });

    const shownSpan = getByText(result, "-1");
    const totalSpan = getByText(result, "-5");
    expect(shownSpan).not.toBeNull();
    expect(totalSpan).not.toBeNull();
  });
});
