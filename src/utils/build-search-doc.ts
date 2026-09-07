/**
 * Shape of a document written to `public/search-index.json`.
 * Extra frontmatter fields are preserved via the rest of the source object.
 */
export interface SearchIndexDoc {
  readonly id: string;
  readonly path: string;
  readonly content: string;
  readonly tags: readonly string[];
  readonly categories: readonly string[];
  readonly heroImage: string;
  readonly draft: boolean | undefined;
}

interface BuildSearchDocInput {
  readonly data: Record<string, unknown>;
  readonly content: string;
  readonly relativePath: string;
}

/**
 * Unpublished posts must not be indexed or served. Gray-matter and the content
 * schema both expose `draft: true` for those files.
 */
export function isPublishedPost(data: object): boolean {
  return !("draft" in data && data.draft === true);
}

/**
 * Builds the search-index record for a markdown file.
 * Id and path are lowercased: Astro's content layer prerenders routes in
 * lowercase (`Hindley-Milner-notation.mdx` → `/blog/functional/hindley-milner-notation/`),
 * and BlogCard builds the href from this id.
 */
export function buildSearchDoc(input: BuildSearchDocInput): SearchIndexDoc {
  const slugNoExt = input.relativePath.replace(/\.mdx?$/, "").toLowerCase();
  const [locale, ...segments] = slugNoExt.split("/");
  const normalizedLocale = locale === "en" ? "en" : "es";
  const blogPath = `/${normalizedLocale}/blog/${segments.join("/")}`;

  const tags = Array.isArray(input.data.tags)
    ? input.data.tags.filter((tag): tag is string => typeof tag === "string")
    : [];
  const categories = Array.isArray(input.data.categories)
    ? input.data.categories.filter(
        (category): category is string => typeof category === "string"
      )
    : [];

  return {
    ...input.data,
    tags,
    categories,
    heroImage:
      typeof input.data.heroImage === "string" ? input.data.heroImage : "",
    content: input.content,
    path: blogPath,
    id: slugNoExt,
    draft: input.data.draft === true,
  };
}
