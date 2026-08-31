/**
 * Category matching for the blog listing.
 *
 * Page 1 used to compare with `includes` (case-sensitive) while later pages
 * lowercased the query param, so a chip like `AI` on `/blog/page/2` produced
 * `?category=ai` and page 1 then showed zero posts.
 */

export const ALL_CATEGORIES = "Todas" as const;

/**
 * True when the listing should ignore the category filter.
 */
export function isAllCategories(selectedCategory: string): boolean {
  return selectedCategory.trim().toLowerCase() === "todas";
}

/**
 * Case-insensitive match of a selected category against a post's categories.
 * An empty or "all" selection matches every post.
 */
export function postHasCategory(
  categories: readonly string[],
  selectedCategory: string
): boolean {
  if (isAllCategories(selectedCategory)) {
    return true;
  }

  const needle = selectedCategory.trim().toLowerCase();
  if (needle.length === 0) {
    return false;
  }

  return categories.some(
    (category) => category.trim().toLowerCase() === needle
  );
}
