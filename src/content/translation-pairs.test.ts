import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";

// Invariantes del contenido que Astro no comprueba y que ya han roto
// producción: un post publicado sin pareja hace que el selector de idioma
// caiga al cambio de prefijo (404), y un punto en el slug (#206) rompe la
// ruta y el índice de búsqueda.

const BLOG_DIR = join(process.cwd(), "src/content/blog");
const LOCALES = ["es", "en"] as const;

// Publicados en un solo idioma a sabiendas. Cada entrada, con su motivo.
const UNPAIRED_ALLOWED: ReadonlySet<string> = new Set<string>([]);

interface Post {
  readonly path: string;
  readonly locale: string;
  readonly draft: boolean;
  readonly translationKey: string | undefined;
}

const posts: readonly Post[] = readdirSync(BLOG_DIR, { recursive: true })
  .map(String)
  .filter((path) => /\.mdx?$/.test(path))
  .map((path) => {
    const { data } = matter(readFileSync(join(BLOG_DIR, path), "utf8"));
    return {
      path,
      locale: path.split(/[\\/]/)[0] ?? "",
      draft: data.draft === true,
      translationKey: data.translationKey,
    };
  });

const published = posts.filter((p) => !p.draft);

describe("blog content", () => {
  it("finds posts in both locales", () => {
    for (const locale of LOCALES) {
      expect(published.some((p) => p.locale === locale)).toBe(true);
    }
  });

  it("has no dot in any slug", () => {
    const dotted = posts
      .map((p) => p.path)
      .filter((path) => /\.[^/\\]*\.mdx?$/.test(path));
    expect(dotted).toEqual([]);
  });

  it("gives every published post a translationKey", () => {
    const missing = published
      .filter((p) => !p.translationKey)
      .map((p) => p.path);
    expect(missing).toEqual([]);
  });

  it("uses each translationKey at most once per locale", () => {
    const seen = published.map((p) => `${p.locale}:${p.translationKey}`);
    const duplicated = seen.filter((key, i) => seen.indexOf(key) !== i);
    expect(duplicated).toEqual([]);
  });

  it("pairs every published post with a published translation", () => {
    const unpaired = published
      .filter((p) => p.translationKey && !UNPAIRED_ALLOWED.has(p.translationKey))
      .filter(
        (p) =>
          !published.some(
            (other) =>
              other.locale !== p.locale &&
              other.translationKey === p.translationKey
          )
      )
      .map((p) => p.path);
    expect(unpaired).toEqual([]);
  });

  it("keeps the allow-list honest", () => {
    const stale = [...UNPAIRED_ALLOWED].filter(
      (key) =>
        new Set(
          published.filter((p) => p.translationKey === key).map((p) => p.locale)
        ).size !== 1
    );
    expect(stale).toEqual([]);
  });
});
