// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByText, getByLabelText } from "@testing-library/dom";
import SocialProfileMenu from "./SocialProfileMenu.astro";
import { renderAstroComponent } from "../test/helpers.ts";

const props = {
  name: "Jane Smith",
  email: "jane@example.com",
  linkedinUrl: "https://linkedin.com/in/janesmith",
  xUrl: "https://x.com/janesmith",
  lang: "es",
  avatarSrc: "/avatar.png",
};

const render = (overrides: Partial<typeof props> = {}) =>
  renderAstroComponent(SocialProfileMenu, { props: { ...props, ...overrides } });

describe("SocialProfileMenu", () => {
  test("el disparador y el contenido cuelgan de la misma raíz del dropdown", async () => {
    const result = await render();
    const root = result.querySelector('[data-slot="dropdown-menu"]');

    // `createDropdownMenu` lanza si no encuentra ambos slots bajo la raíz.
    expect(root).not.toBeNull();
    expect(root?.querySelector('[data-slot="dropdown-menu-trigger"]')).not.toBeNull();
    expect(root?.querySelector('[data-slot="dropdown-menu-content"]')).not.toBeNull();
  });

  test("el disparador es el propio <button>, no un div envolvente", async () => {
    const result = await render();
    const trigger = result.querySelector('[data-slot="dropdown-menu-trigger"]');

    // Importa porque el runtime cuelga de aquí aria-haspopup, aria-controls y
    // aria-expanded: tienen que caer sobre el elemento que se pulsa.
    expect(trigger?.tagName).toBe("BUTTON");
    expect(trigger?.getAttribute("type")).toBe("button");
  });

  test("el contenido nace oculto", async () => {
    const result = await render();
    const content = result.querySelector('[data-slot="dropdown-menu-content"]');

    expect(content?.hasAttribute("hidden")).toBe(true);
  });

  test("muestra nombre y email", async () => {
    const result = await render();

    expect(getByText(result, "Jane Smith")).not.toBeNull();
    expect(getByText(result, "jane@example.com")).not.toBeNull();
  });

  test("los ítems son enlaces reales, no divs con JS", async () => {
    const result = await render();
    const items = [
      ...result.querySelectorAll('[data-slot="dropdown-menu-item"]'),
    ];

    expect(items).toHaveLength(2);
    for (const item of items) {
      // Un <div role="menuitem"> perdería clic central y "abrir en pestaña nueva".
      expect(item.tagName).toBe("A");
      expect(item.getAttribute("role")).toBe("menuitem");
      expect(item.getAttribute("target")).toBe("_blank");
      expect(item.getAttribute("rel")).toBe("noopener noreferrer");
    }

    expect(items[0]?.getAttribute("href")).toBe(props.linkedinUrl);
    expect(items[1]?.getAttribute("href")).toBe(props.xUrl);
  });

  test("usa las etiquetas traducidas del idioma recibido", async () => {
    const es = await render({ lang: "es" });
    const en = await render({ lang: "en" });

    expect(getByLabelText(es, /linkedin/i)).not.toBeNull();
    expect(getByLabelText(en, /linkedin/i)).not.toBeNull();
    expect(es.querySelector("img")?.getAttribute("alt")).not.toBe(
      en.querySelector("img")?.getAttribute("alt")
    );
  });

  test("pinta el avatar recibido", async () => {
    const result = await render({ avatarSrc: "/otro-avatar.png" });

    expect(result.querySelector("img")?.getAttribute("src")).toBe(
      "/otro-avatar.png"
    );
  });
});
