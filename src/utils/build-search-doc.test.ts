import { describe, expect, it } from "vitest";
import { buildSearchDoc, isPublishedPost } from "./build-search-doc";

describe("isPublishedPost", () => {
  it("treats draft: true as unpublished", () => {
    expect(isPublishedPost({ draft: true })).toBe(false);
  });

  it("treats missing or false draft as published", () => {
    expect(isPublishedPost({})).toBe(true);
    expect(isPublishedPost({ draft: false })).toBe(true);
  });
});

describe("buildSearchDoc", () => {
  it("lowercases slugs so search cards match prerendered routes", () => {
    const doc = buildSearchDoc({
      data: {
        title: "Hindley-Milner notation",
        draft: false,
        tags: ["functional"],
        categories: ["functional"],
      },
      content: "type notation",
      relativePath: "en/functional/Hindley-Milner-notation.mdx",
    });

    expect(doc.id).toBe("en/functional/hindley-milner-notation");
    expect(doc.path).toBe("/en/blog/functional/hindley-milner-notation");
  });

  it("defaults missing tags, categories and heroImage", () => {
    const doc = buildSearchDoc({
      data: { title: "A post" },
      content: "hello",
      relativePath: "es/hello.md",
    });

    expect(doc.tags).toEqual([]);
    expect(doc.categories).toEqual([]);
    expect(doc.heroImage).toBe("");
    expect(doc.draft).toBe(false);
  });
});
