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

// Dónde cae `post` dentro de su serie, contando solo los posts publicados del
// mismo locale. `part` es la posición, no `order`: un hueco en la numeración
// (o un borrador) no deja «Parte 4 de 3».
export function seriesNav<T extends SeriesPost>(
  post: T,
  posts: readonly T[]
): SeriesNav<T> | undefined {
  const series = post.data.series;
  if (!series) return undefined;
  const lang = post.id.split("/")[0];
  const members = posts
    .filter(
      (p) =>
        !p.data.draft &&
        p.data.series?.id === series.id &&
        p.id.split("/")[0] === lang
    )
    .sort((a, b) => (a.data.series?.order ?? 0) - (b.data.series?.order ?? 0));
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
