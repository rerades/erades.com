import { afterEach, describe, expect, it, vi } from "vitest";
import fs from "fs/promises";

import { searchPosts } from "./search-posts";

const publishedDoc = {
  id: "en/functional/hindley-milner-notation",
  title: "Hindley-Milner notation",
  description: "Understanding Hindley-Milner type notation",
  tags: ["functional", "Hindley-Milner"],
  categories: ["functional"],
  content: "Hindley-Milner type notation for function signatures",
  path: "/en/blog/functional/hindley-milner-notation",
  heroImage: "",
  draft: false,
};

const draftDoc = {
  id: "es/functional/monads",
  title: "monadas",
  description: "Explorando monadas como funtores",
  tags: ["functors"],
  categories: ["functional"],
  content: "Explorando monadas como funtores especializados",
  path: "/es/blog/functional/monads",
  heroImage: "",
  draft: true,
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("searchPosts", () => {
  it("omits draft documents even if they are still in the index file", async () => {
    vi.spyOn(fs, "readFile").mockResolvedValue(
      JSON.stringify([publishedDoc, draftDoc])
    );

    const results = await searchPosts("monadas");

    expect(results.map((doc) => doc.id)).not.toContain("es/functional/monads");
  });

  it("returns no results for an empty query", async () => {
    const readFile = vi.spyOn(fs, "readFile");

    expect(await searchPosts("   ")).toEqual([]);
    expect(readFile).not.toHaveBeenCalled();
  });
});
