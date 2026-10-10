export interface SeriesPost {
  readonly id: string;
  readonly data: {
    readonly draft?: boolean;
    readonly series?: { readonly id: string; readonly order: number };
  };
}

export interface SeriesNav<T> {
  readonly id: string;
  readonly part: number;
  readonly total: number;
  readonly prev?: T;
  readonly next?: T;
}

const langOf = (post: SeriesPost): string => post.id.split("/")[0] ?? "";

// Los posts publicados de la serie `id` en `lang`, por `order`.
export function seriesPosts<T extends SeriesPost>(
  id: string,
  lang: string,
  posts: readonly T[]
): T[] {
  return posts
    .filter(
      (p) => !p.data.draft && p.data.series?.id === id && langOf(p) === lang
    )
    .sort((a, b) => (a.data.series?.order ?? 0) - (b.data.series?.order ?? 0));
}

// Las series con algún post publicado en `lang`, para generar sus índices.
export function seriesIds(lang: string, posts: readonly SeriesPost[]): string[] {
  const ids = posts
    .filter((p) => !p.data.draft && langOf(p) === lang)
    .flatMap((p) => (p.data.series ? [p.data.series.id] : []));
  return [...new Set(ids)];
}

// Dónde cae `post` dentro de su serie, contando solo los posts publicados del
// mismo locale. `part` es la posición, no `order`: un hueco en la numeración
// (o un borrador) no deja «Parte 4 de 3».
export function seriesNav<T extends SeriesPost>(
  post: T,
  posts: readonly T[]
): SeriesNav<T> | undefined {
  const series = post.data.series;
  if (!series) return undefined;
  const members = seriesPosts(series.id, langOf(post), posts);
  const index = members.findIndex((p) => p.id === post.id);
  if (index === -1) return undefined;
  return {
    id: series.id,
    part: index + 1,
    total: members.length,
    prev: members[index - 1],
    next: members[index + 1],
  };
}
