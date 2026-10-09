import { describe, expect, it } from "vitest";
import { readingTime } from "./reading-time";

describe("readingTime", () => {
  it("redondea a 250 palabras por minuto", () => {
    expect(readingTime("palabra ".repeat(1000))).toBe(4);
  });

  it("nunca baja de 1 minuto", () => {
    expect(readingTime("")).toBe(1);
    expect(readingTime("hola")).toBe(1);
  });

  it("no cuenta el marcado de un SVG ni las etiquetas", () => {
    const svg = `<svg>${"<text>x</text> ".repeat(2000)}</svg>`;
    expect(readingTime(`${svg} <Aside type="note">hola</Aside>`)).toBe(1);
  });
});
