import { describe, expect, it } from "vitest";
import { resolveHeroImage } from "./hero-image";

describe("resolveHeroImage", () => {
  it("resuelve una portada de src/assets/heroes al asset importado", () => {
    const image = resolveHeroImage("/hero-software-factories.jpg");

    expect(typeof image).toBe("object");
    expect(image).toMatchObject({ format: "jpg" });
  });

  it("devuelve undefined si la imagen no está en heroes", () => {
    expect(resolveHeroImage("/no-existe.jpg")).toBeUndefined();
  });

  it("no rompe con un post sin portada", () => {
    expect(resolveHeroImage(undefined)).toBeUndefined();
  });

  it("toda portada del contenido existe en src/assets/heroes", () => {
    const posts = import.meta.glob<string>("../content/blog/**/*.{md,mdx}", {
      query: "?raw",
      import: "default",
      eager: true,
    });
    const missing = Object.entries(posts)
      .map(([path, raw]) => [path, /^heroImage:\s*["']?([^"'\n]+)/m.exec(raw)?.[1]])
      .filter(([, hero]) => hero && !resolveHeroImage(hero));

    expect(missing).toEqual([]);
  });
});
