import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";
import { LEGACY_TAGS } from "../utils/legacy-tags";

// Invariantes del contenido que Astro no comprueba y que ya han roto
// producción: un post publicado sin pareja hace que el selector de idioma
// caiga al cambio de prefijo (404), y un punto en el slug (#206) rompe la
// ruta y el índice de búsqueda.
//
// El borrador es del artículo, no de la versión (CONTEXT.md): las dos versiones
// salen juntas o ninguna. No hace falta un test propio: si una está en borrador
// y la otra no, la publicada se queda sin pareja y falla el de abajo.

const BLOG_DIR = join(process.cwd(), "src/content/blog");
const LOCALES = ["es", "en"] as const;

// Publicados en un solo idioma a sabiendas. Cada entrada, con su motivo.
const UNPAIRED_ALLOWED: ReadonlySet<string> = new Set<string>([]);

interface Post {
  readonly path: string;
  readonly locale: string;
  readonly draft: boolean;
  readonly translationKey: string | undefined;
  readonly tags: readonly string[];
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
      tags: data.tags ?? [],
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

  it("pairs every published post with a published translation (so a draft holds back the whole article)", () => {
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

  // Tag: identificador neutro respecto al idioma (CONTEXT.md).
  it("writes every tag as lowercase kebab-case", () => {
    const bad = posts.flatMap((p) =>
      p.tags.filter((tag) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(tag))
    );
    expect([...new Set(bad)]).toEqual([]);
  });

  it("redirects every legacy tag to a tag that exists", () => {
    const current = new Set(published.flatMap((p) => p.tags));
    const dangling = Object.values(LEGACY_TAGS).filter((t) => !current.has(t));
    expect(dangling).toEqual([]);
  });

  it("gives both versions of an article the same tags", () => {
    const differing = published
      .filter((p) => p.locale === "es" && p.translationKey)
      .filter((p) => {
        const other = published.find(
          (o) => o.locale === "en" && o.translationKey === p.translationKey
        );
        return other && [...p.tags].sort().join() !== [...other.tags].sort().join();
      })
      .map((p) => p.translationKey);
    expect(differing).toEqual([]);
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
