import { describe, expect, test } from "vitest";
import NativeSelect from "./NativeSelect.astro";
import { renderAstroComponent } from "../../../test/helpers";

// Lo que este test protege es justo lo que BlogFilters dejó de escribir a mano:
// que dentro sigue habiendo un <select> nativo (no un widget en JS), que el
// envoltorio es el posicionado y que el chevron es decorativo y no se come el
// clic.
describe("NativeSelect (bejamas/ui)", () => {
  test("renderiza un <select> nativo dentro del envoltorio posicionado", async () => {
    const result = await renderAstroComponent(NativeSelect, {
      props: { name: "sortBy" },
    });
    const wrapper = result.firstElementChild;
    const select = wrapper?.querySelector("select");

    expect(wrapper?.getAttribute("data-slot")).toBe("native-select-wrapper");
    expect(wrapper?.classList.contains("relative")).toBe(true);
    expect(select).not.toBeNull();
    expect(select?.getAttribute("name")).toBe("sortBy");
  });

  test("el chevron es decorativo y no intercepta el clic", async () => {
    const result = await renderAstroComponent(NativeSelect);
    const icon = result.querySelector('[data-slot="native-select-icon"]');

    expect(icon?.getAttribute("aria-hidden")).toBe("true");
    expect(icon?.classList.contains("pointer-events-none")).toBe(true);
  });

  test("la clase del consumidor va al envoltorio", async () => {
    const result = await renderAstroComponent(NativeSelect, {
      props: { class: "w-40" },
    });

    expect(result.firstElementChild?.classList.contains("w-40")).toBe(true);
  });
});
