// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import SeriesNav from "./SeriesNav.astro";
import type { CollectionEntry } from "astro:content";
import { renderAstroComponent } from "../test/helpers.ts";

const post = (id: string, title: string): CollectionEntry<"blog"> => ({
  id,
  collection: "blog",
  body: "",
  data: {
    title,
    description: "",
    pubDate: new Date("2026-01-01"),
    tags: [],
    categories: [],
    draft: false,
  },
});

describe("SeriesNav", () => {
  test("pinta la parte y enlaza anterior y siguiente", async () => {
    const result = await renderAstroComponent(SeriesNav, {
      props: {
        series: {
          id: "functional",
          part: 2,
          total: 3,
          prev: post("en/functional/a", "A"),
          next: post("en/functional/c", "C"),
        },
        lang: "en",
      },
    });
    expect(result.querySelector("p")?.textContent).toContain("Functional programming · Part 2 of 3");
    expect(result.querySelector('a[rel="prev"]')?.getAttribute("href")).toBe("/en/blog/functional/a/");
    expect(result.querySelector('a[rel="next"]')?.textContent).toContain("C");
    expect(result.querySelector("p a")?.getAttribute("href")).toBe("/en/series/functional/");
  });

  test("el primero de la serie no enlaza a un anterior", async () => {
    const result = await renderAstroComponent(SeriesNav, {
      props: {
        series: { id: "ai", part: 1, total: 2, next: post("es/ia/b", "B") },
        lang: "es",
      },
    });
    expect(result.querySelector('a[rel="prev"]')).toBeNull();
    expect(result.querySelector('a[rel="next"]')).not.toBeNull();
  });

  test("sin serie no pinta nada", async () => {
    const result = await renderAstroComponent(SeriesNav, {
      props: { lang: "es" },
    });
    expect(result.querySelector('[data-testid="series-nav"]')).toBeNull();
  });
});
