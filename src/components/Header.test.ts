// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import {
  getByText,
  getByRole,
  getByAltText,
  getAllByText,
} from "@testing-library/dom";
import Header from "./Header.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("Header", () => {
  test("renders header with correct structure", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    const header = result.querySelector("header");
    expect(header).not.toBeNull();
    expect(header?.classList.contains("sticky")).toBe(true);
    expect(header?.classList.contains("top-0")).toBe(true);
  });

  test("renders logo with correct attributes", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    const logo = getByAltText(result, "Logo de Area 73");
    expect(logo).not.toBeNull();
    expect(logo?.getAttribute("src")).toContain("area73-small.png");
    expect(logo?.classList.contains("h-12")).toBe(true);
    expect(logo?.classList.contains("w-12")).toBe(true);
  });

  test("renders navigation menu", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    const nav = result.querySelector("nav");
    expect(nav).not.toBeNull();
  });

  test("renders all navigation links", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    const homeLinks = getAllByText(result, "Inicio");
    const blogLinks = getAllByText(result, "Blog");
    const aboutLinks = getAllByText(result, "Acerca de");
    const tagsLinks = getAllByText(result, "Tags y Categorías");

    expect(homeLinks.length).toBeGreaterThan(0);
    expect(blogLinks.length).toBeGreaterThan(0);
    expect(aboutLinks.length).toBeGreaterThan(0);
    expect(tagsLinks.length).toBeGreaterThan(0);
  });

  test("renders language toggle buttons", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    const esButton = result.querySelector('[data-lang-switch="es"]');
    const enButton = result.querySelector('[data-lang-switch="en"]');

    expect(esButton).not.toBeNull();
    expect(enButton).not.toBeNull();
    expect(esButton?.textContent?.trim()).toBe("ES");
    expect(enButton?.textContent?.trim()).toBe("EN");
  });

  test("applies active state to current language button", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    const esButton = result.querySelector('[data-lang-switch="es"]');
    const enButton = result.querySelector('[data-lang-switch="en"]');

    expect(esButton?.classList.contains("bg-primary")).toBe(true);
    expect(esButton?.getAttribute("aria-current")).toBe("page");
    expect(enButton?.classList.contains("bg-primary")).toBe(false);
  });

  test("exposes the language switches in both desktop and mobile menus", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    // Regresion: antes iban por id y el id estaba duplicado, asi que los
    // botones del menu movil nunca recibian listener.
    expect(result.querySelectorAll('[data-lang-switch="es"]').length).toBe(2);
    expect(result.querySelectorAll('[data-lang-switch="en"]').length).toBe(2);
    expect(result.querySelectorAll("#lang-es").length).toBe(0);
    expect(result.querySelectorAll("#lang-en").length).toBe(0);
  });

  test("renders theme toggle", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    // Verificar que el componente ThemeToggle está presente
    expect(result.innerHTML).toBeTruthy();
  });

  test("renders search box on desktop", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    const searchContainer = result.querySelector(".hidden.md\\:block");
    expect(searchContainer).not.toBeNull();
  });

  test("renders avatar button", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    const avatarButton = result.querySelector("#avatar-btn");
    expect(avatarButton).not.toBeNull();
    expect(avatarButton?.getAttribute("type")).toBe("button");
    expect(avatarButton?.getAttribute("aria-haspopup")).toBe("true");
  });

  test("renders avatar image", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    const avatar = getByAltText(result, "Avatar de usuario");
    expect(avatar).not.toBeNull();
    expect(avatar?.getAttribute("src")).toContain("avatar.png");
    expect(avatar?.classList.contains("h-8")).toBe(true);
    expect(avatar?.classList.contains("w-8")).toBe(true);
  });

  test("renders social profile menu", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    const socialMenu = result.querySelector("#avatar-menu");
    expect(socialMenu).not.toBeNull();
  });

  test("renders with English language", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "en",
      },
    });

    const homeLinks = getAllByText(result, "Home");
    expect(homeLinks.length).toBeGreaterThan(0);
  });

  test("renders with Spanish language", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    const homeLinks = getAllByText(result, "Inicio");
    expect(homeLinks.length).toBeGreaterThan(0);
  });

  test("has correct header classes", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    const header = result.querySelector("header");
    expect(header?.classList.contains("w-full")).toBe(true);
    expect(header?.classList.contains("sticky")).toBe(true);
  });

  test("has correct container structure", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    const container = result.querySelector("div");
    expect(container?.classList.contains("max-w-[1440px]")).toBe(true);
  });

  test("renders chevron down icon in avatar button", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    const chevronIcon = result.querySelector(".lucide-chevron-down");
    expect(chevronIcon).not.toBeNull();
  });

  test("has correct navigation link structure", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    const nav = result.querySelector("nav");
    expect(nav?.classList.contains("hidden")).toBe(true);
    expect(nav?.classList.contains("md:flex")).toBe(true);
  });

  test("renders inline scripts", async () => {
    const result = await renderAstroComponent(Header, {
      props: {
        lang: "es",
      },
    });

    const scripts = result.querySelectorAll("script");
    expect(scripts.length).toBeGreaterThan(0);
  });
});
