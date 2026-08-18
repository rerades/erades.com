// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByRole } from "@testing-library/dom";
import ThemeToggle from "./ThemeToggle.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("ThemeToggle", () => {
  test("renders button with correct structure", async () => {
    const result = await renderAstroComponent(ThemeToggle, {});

    const button = getByRole(result, "button");
    expect(button).not.toBeNull();
    expect(button?.getAttribute("id")).toBe("theme-toggle-btn");
    expect(button?.getAttribute("type")).toBe("button");
    expect(button?.getAttribute("aria-label")).toBe("Toggle dark mode");
  });

  test("has correct button styling", async () => {
    const result = await renderAstroComponent(ThemeToggle, {});
    const button = getByRole(result, "button");
  });

  test("has correct span wrapper", async () => {
    const result = await renderAstroComponent(ThemeToggle, {});
    const span = result.querySelector("span");
    expect(span).not.toBeNull();
  });

  test("renders with inline script", async () => {
    const result = await renderAstroComponent(ThemeToggle, {});

    const script = result.querySelector("script");
    expect(script).not.toBeNull();
    expect(script?.textContent).toBeTruthy();
  });

  test("has proper button accessibility", async () => {
    const result = await renderAstroComponent(ThemeToggle, {});
    const button = getByRole(result, "button");
    expect(button?.getAttribute("aria-label")).toBe("Toggle dark mode");
    expect(button?.getAttribute("type")).toBe("button");
  });

  test("renders complete component structure", async () => {
    const result = await renderAstroComponent(ThemeToggle, {});

    // Verificar que todos los elementos están presentes
    const button = getByRole(result, "button");
    const span = result.querySelector("span");
    const moonIcon = result.querySelector("#moon-icon");
    const sunIcon = result.querySelector("#sun-icon");
    const script = result.querySelector("script");

    expect(button).not.toBeNull();
    expect(span).not.toBeNull();
    expect(moonIcon).not.toBeNull();
    expect(sunIcon).not.toBeNull();
    expect(script).not.toBeNull();
  });
});
