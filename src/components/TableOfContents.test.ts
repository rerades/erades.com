// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import TableOfContents from "./TableOfContents.astro";
import { renderAstroComponent } from "../test/helpers.ts";

const headings = [
  { depth: 2, slug: "uno", text: "Uno" },
  { depth: 3, slug: "uno-a", text: "Uno A" },
  { depth: 2, slug: "dos", text: "Dos" },
  { depth: 4, slug: "dos-x", text: "Dos X" },
  { depth: 2, slug: "tres", text: "Tres" },
];

describe("TableOfContents", () => {
  test("no se pinta con menos de tres h2", async () => {
    const result = await renderAstroComponent(TableOfContents, {
      props: { headings: headings.slice(0, 3), lang: "es" },
    });
    expect(result.querySelector("details")).toBeNull();
    expect(result.querySelector("nav")).toBeNull();
  });

  test("enlaza h2 y h3, pero no h4", async () => {
    const result = await renderAstroComponent(TableOfContents, {
      props: { headings, lang: "es" },
    });
    const nav = result.querySelector('[data-testid="toc-desktop"]');
    const hrefs = [...(nav?.querySelectorAll("a") ?? [])].map((a) =>
      a.getAttribute("href")
    );
    expect(hrefs).toEqual(["#uno", "#uno-a", "#dos", "#tres"]);
  });

  test("en móvil es un <details> cerrado, sin JS", async () => {
    const result = await renderAstroComponent(TableOfContents, {
      props: { headings, lang: "es" },
    });
    const details = result.querySelector('[data-testid="toc-mobile"]');
    expect(details?.tagName).toBe("DETAILS");
    expect(details?.hasAttribute("open")).toBe(false);
    expect(result.querySelector("script")).toBeNull();
  });

  test.each([
    ["es", "En este artículo"],
    ["en", "On this page"],
  ])("título traducido en %s", async (lang, title) => {
    const result = await renderAstroComponent(TableOfContents, {
      props: { headings, lang },
    });
    expect(result.querySelector("summary")?.textContent).toBe(title);
    expect(result.querySelector("nav")?.getAttribute("aria-label")).toBe(title);
  });
});
