// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import RelatedPosts from "./RelatedPosts.astro";
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

describe("RelatedPosts", () => {
  test("pinta una tarjeta por post bajo el título traducido", async () => {
    const result = await renderAstroComponent(RelatedPosts, {
      props: { posts: [post("en/a", "A"), post("en/b", "B")], lang: "en" },
    });
    expect(result.querySelector("h2")?.textContent).toBe("Keep reading");
    expect(result.querySelectorAll('a[aria-label="grid-card"]')).toHaveLength(2);
    expect(result.querySelector('a[href="/en/blog/a/"]')).not.toBeNull();
  });

  test("sin posts no pinta nada", async () => {
    const result = await renderAstroComponent(RelatedPosts, {
      props: { posts: [], lang: "es" },
    });
    expect(result.querySelector('[data-testid="related-posts"]')).toBeNull();
  });
});
