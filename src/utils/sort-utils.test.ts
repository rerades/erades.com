/**
 * Unit tests for sort-utils.ts
 */
import { describe, it, expect } from "vitest";
import { sortPosts, type SortablePost } from "./sort-utils";

describe("sortPosts", () => {
  const posts: SortablePost[] = [
    { pubDate: "2023-01-01", title: "B" },
    { pubDate: "2022-01-01", title: "A" },
    { pubDate: "2024-01-01", title: "C" },
    { data: { pubDate: "2021-01-01", title: "D" } },
    { data: { pubDate: "2025-01-01", title: "E" } },
  ];

  it("sorts by date ascending", () => {
    const sorted = sortPosts(posts, "date-asc");
    expect(sorted.map((p) => p.pubDate || p.data?.pubDate)).toEqual([
      "2021-01-01",
      "2022-01-01",
      "2023-01-01",
      "2024-01-01",
      "2025-01-01",
    ]);
  });

  it("sorts by date descending", () => {
    const sorted = sortPosts(posts, "date-desc");
    expect(sorted.map((p) => p.pubDate || p.data?.pubDate)).toEqual([
      "2025-01-01",
      "2024-01-01",
      "2023-01-01",
      "2022-01-01",
      "2021-01-01",
    ]);
  });

  it("desempata por título cuando la fecha coincide, venga en el orden que venga", () => {
    const sameDate: SortablePost[] = [
      { pubDate: "2025-11-02", title: "ai-rules: reglas para IA" },
      { pubDate: "2025-11-02", title: "ai-rules-cli: CLI para reglas de IA" },
    ];
    const titlesOf = (input: SortablePost[], sortBy: "date-asc" | "date-desc") =>
      sortPosts(input, sortBy).map((p) => p.title);

    for (const sortBy of ["date-asc", "date-desc"] as const) {
      expect(titlesOf(sameDate, sortBy)).toEqual(
        titlesOf([...sameDate].reverse(), sortBy)
      );
    }
  });

  it("sorts by title", () => {
    const sorted = sortPosts(posts, "title");
    expect(sorted.map((p) => p.title || p.data?.title)).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
    ]);
  });
});
