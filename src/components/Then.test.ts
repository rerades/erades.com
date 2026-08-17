// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByText } from "@testing-library/dom";
import Then from "./Then.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("Then", () => {
  test("renders with slot content", async () => {
    const result = await renderAstroComponent(Then, {
      slots: {
        default: "Contenido del slot",
      },
    });

    const content = getByText(result, "Contenido del slot");
    expect(content).not.toBeNull();
  });

  test("renders with empty slot", async () => {
    const result = await renderAstroComponent(Then, {
      slots: {
        default: "",
      },
    });

    // El componente Then ahora es un simple wrapper, no tiene div con data-then-marker
    expect(result.innerHTML).toBe("");
  });

  test("renders with HTML content in slot", async () => {
    const result = await renderAstroComponent(Then, {
      slots: {
        default: "<span>HTML content</span>",
      },
    });

    const span = result.querySelector("span");
    expect(span).not.toBeNull();
    expect(span?.textContent).toBe("HTML content");
  });

  test("renders with complex content", async () => {
    const result = await renderAstroComponent(Then, {
      slots: {
        default:
          "Contenido complejo con <strong>HTML</strong> y <em>formato</em>",
      },
    });

    const strong = result.querySelector("strong");
    const em = result.querySelector("em");

    expect(strong).not.toBeNull();
    expect(em).not.toBeNull();
    expect(strong?.textContent).toBe("HTML");
    expect(em?.textContent).toBe("formato");
  });

  test("renders with no slot content", async () => {
    const result = await renderAstroComponent(Then, {});

    // El componente Then ahora es un simple wrapper, sin contenido devuelve vacío
    expect(result.innerHTML).toBe("");
  });

  test("acts as transparent wrapper", async () => {
    const result = await renderAstroComponent(Then, {
      slots: {
        default: "<div class='test'>Test content</div>",
      },
    });

    // El componente debe pasar el contenido directamente sin wrappers adicionales
    const testDiv = result.querySelector(".test");
    expect(testDiv).not.toBeNull();
    expect(testDiv?.textContent).toBe("Test content");
  });
});
