// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import LanguageSwitch from "./LanguageSwitch.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("LanguageSwitch", () => {
  test("pinta un botón por idioma con su atributo de datos", async () => {
    const result = await renderAstroComponent(LanguageSwitch, {
      props: { lang: "es" },
    });
    const buttons = [...result.querySelectorAll("button")];

    expect(buttons).toHaveLength(2);
    expect(buttons.map((b) => b.getAttribute("data-lang-switch"))).toEqual([
      "es",
      "en",
    ]);
    expect(buttons.map((b) => b.textContent?.trim())).toEqual(["ES", "EN"]);
  });

  test("marca como activo solo el idioma recibido", async () => {
    const es = await renderAstroComponent(LanguageSwitch, {
      props: { lang: "es" },
    });
    const en = await renderAstroComponent(LanguageSwitch, {
      props: { lang: "en" },
    });

    expect(
      es.querySelector('[data-lang-switch="es"]')?.getAttribute("aria-current")
    ).toBe("page");
    expect(
      es.querySelector('[data-lang-switch="en"]')?.getAttribute("aria-current")
    ).toBeNull();
    expect(
      en.querySelector('[data-lang-switch="en"]')?.getAttribute("aria-current")
    ).toBe("page");
  });

  test("propaga la clase del contenedor", async () => {
    const result = await renderAstroComponent(LanguageSwitch, {
      props: { lang: "es", class: "mi-clase" },
    });

    expect(result.firstElementChild?.classList.contains("mi-clase")).toBe(true);
  });
});
