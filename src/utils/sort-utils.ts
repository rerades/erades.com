/**
 * Utility functions for sorting blog posts and similar content.
 * Supports sorting by date (asc/desc), title, and can be extended.
 */

export type SortBy = "date-asc" | "date-desc" | "title";

export interface SortablePost {
  pubDate?: string | Date;
  data?: {
    pubDate?: string | Date;
    title?: string;
  };
  title?: string;
}

export const SORT_BY_OPTIONS = ["date-asc", "date-desc", "title"] as const;

/**
 * Sorts an array of posts by the given sortBy criteria.
 * @param posts Array of posts to sort
 * @param sortBy Sorting criteria
 * @returns Sorted array
 */
export function sortPosts<T extends SortablePost>(
  posts: T[],
  sortBy: SortBy
): T[] {
  const getDate = (post: T): number => {
    const date = post.pubDate || post.data?.pubDate;
    return date ? new Date(date).valueOf() : 0;
  };
  const getTitle = (post: T): string => post.title || post.data?.title || "";

  // Desempate por título: hay posts que comparten pubDate, y sin esto su orden
  // relativo lo decide el orden en que getCollection los devuelve, que cambia
  // entre sistemas de ficheros y entre versiones de astro.
  const byTitle = (a: T, b: T): number => getTitle(a).localeCompare(getTitle(b));

  switch (sortBy) {
    case "date-asc":
      return [...posts].sort((a, b) => getDate(a) - getDate(b) || byTitle(a, b));
    case "date-desc":
      return [...posts].sort((a, b) => getDate(b) - getDate(a) || byTitle(a, b));
    case "title":
      return [...posts].sort(byTitle);
    default:
      return posts;
  }
}
