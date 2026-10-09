// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import ReadingTime from "./ReadingTime.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("ReadingTime", () => {
  test.each([
    ["es", "7 min de lectura"],
    ["en", "7 min read"],
  ])("traduce los minutos en %s", async (lang, text) => {
    const result = await renderAstroComponent(ReadingTime, {
      props: { minutes: 7, lang },
    });
    expect(result.textContent?.trim()).toBe(text);
  });
});
