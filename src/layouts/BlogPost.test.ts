import { describe, expect, test } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import BlogPost from "./BlogPost.astro";

const render = async (props: Record<string, unknown>): Promise<Record<string, unknown>> => {
  const container = await AstroContainer.create({
    astroConfig: { site: "https://erades.com" },
  });
  const html = await container.renderToString(BlogPost, {
    props,
    request: new Request("https://erades.com/es/blog/funcional/funtores/"),
  });
  const match = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
  expect(match).not.toBeNull();
  return JSON.parse(match![1]!) as Record<string, unknown>;
};

describe("BlogPost JSON-LD", () => {
  test("emite un BlogPosting con los datos del frontmatter", async () => {
    const data = await render({
      title: "Funtores </script>",
      description: "Qué es un funtor",
      pubDate: new Date("2026-01-02T00:00:00Z"),
      updatedDate: new Date("2026-02-03T00:00:00Z"),
      heroImage: "/hero.webp",
      tags: [],
      categories: [],
      draft: false,
      lang: "es",
    });

    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "Funtores </script>",
      description: "Qué es un funtor",
      datePublished: "2026-01-02T00:00:00.000Z",
      dateModified: "2026-02-03T00:00:00.000Z",
      author: { "@type": "Person", name: "Rodrigo Erades" },
      inLanguage: "es",
    });
    expect(data.image).toMatch(/\/hero\.webp$/);
    expect(data.mainEntityOfPage).toMatch(/\/es\/blog\/funcional\/funtores\/$/);
  });

  test("sin updatedDate, dateModified es la fecha de publicación", async () => {
    const data = await render({
      title: "t",
      description: "d",
      pubDate: new Date("2026-01-02T00:00:00Z"),
      tags: [],
      categories: [],
      draft: false,
      lang: "en",
    });
    expect(data.dateModified).toBe("2026-01-02T00:00:00.000Z");
  });
});
