import { describe, it, expect } from "vitest";
import {
  ALL_CATEGORIES,
  isAllCategories,
  postHasCategory,
} from "./filter-posts";

describe("isAllCategories", () => {
  it("treats the listing sentinel as unfiltered, regardless of case", () => {
    expect(isAllCategories(ALL_CATEGORIES)).toBe(true);
    expect(isAllCategories("todas")).toBe(true);
    expect(isAllCategories(" AI ")).toBe(false);
  });
});

describe("postHasCategory", () => {
  const categories = ["AI", "Crafting"] as const;

  it("matches mixed-case chips against mixed-case frontmatter", () => {
    expect(postHasCategory(categories, "AI")).toBe(true);
    expect(postHasCategory(categories, "ai")).toBe(true);
    expect(postHasCategory(categories, "Crafting")).toBe(true);
  });

  it("does not match an unrelated category", () => {
    expect(postHasCategory(categories, "javascript")).toBe(false);
    expect(postHasCategory([], "AI")).toBe(false);
  });

  it("keeps every post when the selection is the all-categories sentinel", () => {
    expect(postHasCategory(categories, ALL_CATEGORIES)).toBe(true);
    expect(postHasCategory([], ALL_CATEGORIES)).toBe(true);
  });
});
