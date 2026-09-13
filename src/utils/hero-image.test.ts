import { describe, expect, it } from "vitest";
import { resolveHeroImage } from "./hero-image";

describe("resolveHeroImage", () => {
  it("resuelve una portada de src/assets/heroes al asset importado", () => {
    const image = resolveHeroImage("/hero-software-factories.jpg");

    expect(typeof image).toBe("object");
    expect(image).toMatchObject({ format: "jpg" });
  });

  it("devuelve la ruta tal cual si la imagen no está en heroes", () => {
    expect(resolveHeroImage("/no-existe.jpg")).toBe("/no-existe.jpg");
  });

  it("no rompe con un post sin portada", () => {
    expect(resolveHeroImage(undefined)).toBeUndefined();
  });
});
