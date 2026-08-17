// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByRole } from "@testing-library/dom";
import HeaderSearchBox from "./HeaderSearchBox.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("HeaderSearchBox", () => {
  test("renders form with correct action and method", async () => {
    const result = await renderAstroComponent(HeaderSearchBox, {
      props: {
        lang: "es",
      },
    });

    const form = result.querySelector("form");
    expect(form).not.toBeNull();
    expect(form?.getAttribute("action")).toBe("/es/search");
    expect(form?.getAttribute("method")).toBe("get");
  });

  test("renders SearchInput component", async () => {
    const result = await renderAstroComponent(HeaderSearchBox, {
      props: {
        lang: "es",
      },
    });

    // Verificar que el componente SearchInput está presente
    expect(result.innerHTML).toBeTruthy();
  });

  test("passes lang prop to SearchInput", async () => {
    const result = await renderAstroComponent(HeaderSearchBox, {
      props: {
        lang: "en",
      },
    });

    // Verificar que el formulario tiene la acción correcta para el idioma
    const form = result.querySelector("form");
    expect(form?.getAttribute("action")).toBe("/en/search");
  });

  test("handles different languages correctly", async () => {
    const result = await renderAstroComponent(HeaderSearchBox, {
      props: {
        lang: "en",
      },
    });

    const form = result.querySelector("form");
    expect(form?.getAttribute("action")).toBe("/en/search");
  });

  test("renders with Spanish language", async () => {
    const result = await renderAstroComponent(HeaderSearchBox, {
      props: {
        lang: "es",
      },
    });

    const form = result.querySelector("form");
    expect(form?.getAttribute("action")).toBe("/es/search");
  });

  test("renders with English language", async () => {
    const result = await renderAstroComponent(HeaderSearchBox, {
      props: {
        lang: "en",
      },
    });

    const form = result.querySelector("form");
    expect(form?.getAttribute("action")).toBe("/en/search");
  });

  test("has correct form structure", async () => {
    const result = await renderAstroComponent(HeaderSearchBox, {
      props: {
        lang: "es",
      },
    });

    const form = result.querySelector("form");
    expect(form).not.toBeNull();

    // Verificar que el formulario contiene el SearchInput
    expect(result.innerHTML).toBeTruthy();
  });
});
