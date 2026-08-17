// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByText, getByRole, getByLabelText } from "@testing-library/dom";
import Paginator from "./Paginator.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("Paginator", () => {
  test("renders pagination when totalPages > 1", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 1,
        totalPages: 3,
      },
    });

    const nav = getByRole(result, "navigation");
    expect(nav).not.toBeNull();
    expect(nav?.getAttribute("aria-label")).toBe("Navegación de páginas");
  });

  test("does not render when totalPages <= 1", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 1,
        totalPages: 1,
      },
    });

    const nav = result.querySelector("nav");
    expect(nav).toBeNull();
  });

  test("renders all page numbers", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 2,
        totalPages: 5,
      },
    });

    const page1 = getByText(result, "1");
    const page2 = getByText(result, "2");
    const page3 = getByText(result, "3");
    const page4 = getByText(result, "4");
    const page5 = getByText(result, "5");

    expect(page1).not.toBeNull();
    expect(page2).not.toBeNull();
    expect(page3).not.toBeNull();
    expect(page4).not.toBeNull();
    expect(page5).not.toBeNull();
  });

  test("highlights current page", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 3,
        totalPages: 5,
      },
    });

    const currentPageLink = getByText(result, "3");
    expect(currentPageLink?.classList.contains("bg-primary")).toBe(true);
    expect(currentPageLink?.getAttribute("aria-current")).toBe("page");
  });

  test("renders previous and next buttons", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 2,
        totalPages: 5,
      },
    });

    const prevButton = getByText(result, "Anterior");
    const nextButton = getByText(result, "Siguiente");

    expect(prevButton).not.toBeNull();
    expect(nextButton).not.toBeNull();
  });

  test("disables previous button on first page", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 1,
        totalPages: 5,
      },
    });

    const prevButton = getByText(result, "Anterior");
    expect(prevButton?.tagName).toBe("SPAN");
    expect(prevButton?.getAttribute("aria-disabled")).toBe("true");
    expect(prevButton?.classList.contains("opacity-50")).toBe(true);
  });

  test("disables next button on last page", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 5,
        totalPages: 5,
      },
    });

    const nextButton = getByText(result, "Siguiente");
    expect(nextButton?.tagName).toBe("SPAN");
    expect(nextButton?.getAttribute("aria-disabled")).toBe("true");
    expect(nextButton?.classList.contains("opacity-50")).toBe(true);
  });

  test("enables previous button when not on first page", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 2,
        totalPages: 5,
      },
    });

    const prevButton = getByText(result, "Anterior");
    expect(prevButton?.tagName).toBe("A");
    expect(prevButton?.getAttribute("href")).toBe("/blog/");
  });

  test("enables next button when not on last page", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 2,
        totalPages: 5,
      },
    });

    const nextButton = getByText(result, "Siguiente");
    expect(nextButton?.tagName).toBe("A");
    expect(nextButton?.getAttribute("href")).toBe("/blog/3/");
  });

  test("uses custom getPageHref function", async () => {
    const customGetPageHref = (page: number) => `/custom/page/${page}`;

    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 2,
        totalPages: 5,
        getPageHref: customGetPageHref,
      },
    });

    const page1Link = getByText(result, "1");
    expect(page1Link?.getAttribute("href")).toBe("/custom/page/1");
  });

  test("uses custom labels", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 2,
        totalPages: 5,
        prevLabel: "Previous",
        nextLabel: "Next",
      },
    });

    const prevButton = getByText(result, "Previous");
    const nextButton = getByText(result, "Next");

    expect(prevButton).not.toBeNull();
    expect(nextButton).not.toBeNull();
  });

  test("applies custom class", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 2,
        totalPages: 5,
        customClass: "custom-paginator",
      },
    });

    const nav = getByRole(result, "navigation");
    expect(nav?.classList.contains("custom-paginator")).toBe(true);
  });

  test("uses custom aria label", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 2,
        totalPages: 5,
        ariaLabel: "Custom pagination",
      },
    });

    const nav = getByRole(result, "navigation");
    expect(nav?.getAttribute("aria-label")).toBe("Custom pagination");
  });

  test("renders screen reader text", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 3,
        totalPages: 5,
      },
    });

    const srText = getByText(result, "Página 3 de 5");
    expect(srText).not.toBeNull();
    expect(srText?.classList.contains("sr-only")).toBe(true);
  });

  test("has correct ARIA attributes for page links", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 2,
        totalPages: 5,
      },
    });

    const page1Link = getByText(result, "1");
    expect(page1Link?.getAttribute("aria-label")).toBe("Ir a página 1");
    expect(page1Link?.getAttribute("aria-setsize")).toBe("5");
    expect(page1Link?.getAttribute("aria-posinset")).toBe("1");
  });

  test("handles single page correctly", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 1,
        totalPages: 1,
      },
    });

    const nav = result.querySelector("nav");
    expect(nav).toBeNull();
  });

  test("handles edge case with currentPage > totalPages", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 5,
        totalPages: 3,
      },
    });

    // Should still render but with disabled next button
    const nextButton = getByText(result, "Siguiente");
    expect(nextButton?.tagName).toBe("SPAN");
    expect(nextButton?.getAttribute("aria-disabled")).toBe("true");
    expect(nextButton?.getAttribute("href")).toBeNull();
  });

  test("has correct navigation group structure", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 2,
        totalPages: 5,
      },
    });

    const group = result.querySelector('[role="group"]');
    expect(group).not.toBeNull();
    expect(group?.getAttribute("aria-label")).toBe("Navegación de paginación");
  });

  test("renders with default props", async () => {
    const result = await renderAstroComponent(Paginator, {
      props: {
        currentPage: 1,
        totalPages: 3,
      },
    });

    const nav = getByRole(result, "navigation");
    expect(nav).not.toBeNull();
    expect(nav?.classList.contains("flex")).toBe(true);
    expect(nav?.classList.contains("justify-center")).toBe(true);
    expect(nav?.classList.contains("mt-12")).toBe(true);
  });
});
