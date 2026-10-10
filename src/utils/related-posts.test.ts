import { describe, expect, it } from "vitest";
import { relatedPosts } from "./related-posts";

const post = (id: string, tags: string[], date: string, draft = false) => ({
  id,
  data: { tags, pubDate: new Date(date), draft },
});

describe("relatedPosts", () => {
  const current = post("es/a", ["fp", "ts"], "2026-01-01");
  const posts = [
    current,
    post("es/uno-tag-viejo", ["fp"], "2025-01-01"),
    post("es/uno-tag-nuevo", ["ts"], "2025-06-01"),
    post("es/dos-tags", ["fp", "ts"], "2024-01-01"),
    post("es/sin-tags", [], "2026-02-01"),
    post("es/borrador", ["fp", "ts"], "2026-03-01", true),
    post("en/otro-idioma", ["fp", "ts"], "2026-03-01"),
  ];

  it("ordena por tags en común y después por fecha", () => {
    expect(relatedPosts(current, posts).map((p) => p.id)).toEqual([
      "es/dos-tags",
      "es/uno-tag-nuevo",
      "es/uno-tag-viejo",
    ]);
  });

  it("rellena con posts sin tags en común, ni borradores ni otro idioma", () => {
    expect(relatedPosts(current, posts, 10).map((p) => p.id)).toEqual([
      "es/dos-tags",
      "es/uno-tag-nuevo",
      "es/uno-tag-viejo",
      "es/sin-tags",
    ]);
  });
});
