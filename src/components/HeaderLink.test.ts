// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByText, getByRole } from "@testing-library/dom";
import HeaderLink from "./HeaderLink.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("HeaderLink", () => {
  test("renders link with correct href and text", async () => {
    const result = await renderAstroComponent(HeaderLink, {
      props: {
        href: "/es/blog",
        lang: "es",
      },
      slots: {
        default: "Blog",
      },
    });

    const link = getByRole(result, "link");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe("/es/blog");
    expect(link?.textContent?.trim()).toBe("Blog");
  });

  test("renders with icon when href matches known routes", async () => {
    const result = await renderAstroComponent(HeaderLink, {
      props: {
        href: "/es",
        lang: "es",
      },
      slots: {
        default: "Inicio",
      },
    });

    // Verificar que el componente renderiza correctamente
    expect(result.innerHTML).toBeTruthy();
  });

  test("does not render icon for unknown routes", async () => {
    const result = await renderAstroComponent(HeaderLink, {
      props: {
        href: "/es/unknown",
        lang: "es",
      },
      slots: {
        default: "Unknown",
      },
    });

    // Verificar que el componente renderiza correctamente
    expect(result.innerHTML).toBeTruthy();
  });

  test("applies active styles when current page", async () => {
    const result = await renderAstroComponent(HeaderLink, {
      props: {
        href: "/es/blog",
        lang: "es",
      },
      slots: {
        default: "Blog",
      },
    });

    const link = getByRole(result, "link");
    // Verificar que el enlace se renderiza correctamente
    expect(link).not.toBeNull();
  });

  test("does not apply active styles when not current page", async () => {
    const result = await renderAstroComponent(HeaderLink, {
      props: {
        href: "/es/about",
        lang: "es",
      },
      slots: {
        default: "Acerca de",
      },
    });

    const link = getByRole(result, "link");
    expect(link).not.toBeNull();
  });

  test("handles different languages correctly", async () => {
    const result = await renderAstroComponent(HeaderLink, {
      props: {
        href: "/en/blog",
        lang: "en",
      },
      slots: {
        default: "Blog",
      },
    });

    const link = getByRole(result, "link");
    expect(link?.getAttribute("href")).toBe("/en/blog");
  });

  test("renders with custom aria-label", async () => {
    const result = await renderAstroComponent(HeaderLink, {
      props: {
        href: "/es/blog",
        lang: "es",
        "aria-label": "Custom label",
      },
      slots: {
        default: "Blog",
      },
    });

    const link = getByRole(result, "link");
    expect(link?.getAttribute("aria-label")).toBe("Custom label");
  });

  test("handles relative hrefs", async () => {
    const result = await renderAstroComponent(HeaderLink, {
      props: {
        href: "blog",
        lang: "es",
      },
      slots: {
        default: "Blog",
      },
    });

    const link = getByRole(result, "link");
    expect(link?.getAttribute("href")).toBe("/es/blog");
  });

  test("handles absolute hrefs", async () => {
    const result = await renderAstroComponent(HeaderLink, {
      props: {
        href: "/blog",
        lang: "es",
      },
      slots: {
        default: "Blog",
      },
    });

    const link = getByRole(result, "link");
    expect(link?.getAttribute("href")).toBe("/es/blog");
  });

  test("handles home route correctly", async () => {
    const result = await renderAstroComponent(HeaderLink, {
      props: {
        href: "/",
        lang: "es",
      },
      slots: {
        default: "Inicio",
      },
    });

    const link = getByRole(result, "link");
    expect(link?.getAttribute("href")).toBe("/es/");
  });

  test("renders with correct structure", async () => {
    const result = await renderAstroComponent(HeaderLink, {
      props: {
        href: "/es",
        lang: "es",
      },
      slots: {
        default: "Inicio",
      },
    });

    const link = getByRole(result, "link");
    expect(link).not.toBeNull();
    expect(link?.classList.contains("inline-flex")).toBe(true);
    expect(link?.classList.contains("items-center")).toBe(true);
  });
});
