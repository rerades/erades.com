export interface RelatablePost {
  readonly id: string;
  readonly data: {
    readonly tags: readonly string[];
    readonly pubDate: Date;
    readonly draft?: boolean;
  };
}

// Los `count` posts del mismo locale con más tags en común con `post`, y a
// igualdad los más recientes. Sin tags en común caen igualmente, por fecha:
// un post sin parientes sigue ofreciendo algo que leer.
export function relatedPosts<T extends RelatablePost>(
  post: T,
  posts: readonly T[],
  count = 3
): T[] {
  const lang = post.id.split("/")[0];
  const tags = new Set(post.data.tags);
  const shared = (p: T): number => p.data.tags.filter((t) => tags.has(t)).length;
  return posts
    .filter(
      (p) => p.id !== post.id && !p.data.draft && p.id.split("/")[0] === lang
    )
    .map((p) => ({ p, score: shared(p) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.p.data.pubDate.valueOf() - a.p.data.pubDate.valueOf()
    )
    .slice(0, count)
    .map(({ p }) => p);
}
