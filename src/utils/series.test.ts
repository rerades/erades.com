import { describe, expect, it } from "vitest";
import { seriesNav } from "./series";

const post = (id: string, series?: [string, number], draft = false) => ({
  id,
  data: { draft, ...(series ? { series: { id: series[0], order: series[1] } } : {}) },
});

describe("seriesNav", () => {
  const first = post("es/a", ["fp", 1]);
  const third = post("es/c", ["fp", 3]);
  const last = post("es/e", ["fp", 5]);
  const posts = [
    last,
    third,
    first,
    post("es/borrador", ["fp", 2], true),
    post("es/otra-serie", ["oop", 4]),
    post("en/otro-idioma", ["fp", 4]),
    post("es/suelto"),
  ];

  it("ordena por `order` y numera por posición, sin borradores ni otro idioma", () => {
    expect(seriesNav(third, posts)).toEqual({
      id: "fp",
      part: 2,
      total: 3,
      prev: first,
      next: last,
    });
  });

  it("el primero no tiene anterior y el último no tiene siguiente", () => {
    expect(seriesNav(first, posts)?.prev).toBeUndefined();
    expect(seriesNav(last, posts)?.next).toBeUndefined();
  });

  it("un post sin serie no tiene navegación", () => {
    expect(seriesNav(post("es/suelto"), posts)).toBeUndefined();
  });
});
