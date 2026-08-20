import { describe, expect, test } from "vitest";
import Separator from "./Separator.astro";
import { renderAstroComponent } from "../../../test/helpers";

// Este test es la prueba de humo de la fontanería de bejamas/ui: si el alias
// `@/` deja de resolver, si `cn()` desaparece o si `bg-border` vuelve a ser una
// clase muerta, falla aquí antes que en un componente de verdad.
describe("Separator (bejamas/ui)", () => {
  test("resuelve `@/lib/utils` y aplica el token bg-border", async () => {
    const result = await renderAstroComponent(Separator);
    const separator = result.firstElementChild;

    expect(separator).not.toBeNull();
    expect(separator?.classList.contains("bg-border")).toBe(true);
    expect(separator?.getAttribute("aria-hidden")).toBe("true");
  });

  test("cambia de eje con `orientation`", async () => {
    const horizontal = await renderAstroComponent(Separator);
    const vertical = await renderAstroComponent(Separator, {
      props: { orientation: "vertical" },
    });

    expect(horizontal.firstElementChild?.classList.contains("w-full")).toBe(true);
    expect(vertical.firstElementChild?.classList.contains("h-full")).toBe(true);
  });
})
