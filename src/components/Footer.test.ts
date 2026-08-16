// @vitest-environment happy-dom
import { describe, test, expect } from "vitest";
import Footer from "./Footer.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("Footer", () => {
  test("renders a semantic footer element", async () => {
    const result = await renderAstroComponent(Footer, { props: { lang: "es" } });
    expect(result.querySelector("footer")).not.toBeNull();
  });

  test("renders copyright with current year and owner", async () => {
    const result = await renderAstroComponent(Footer, { props: { lang: "es" } });
    const copy = result.querySelector('[data-testid="footer-copyright"]');
    expect(copy?.textContent).toContain(String(new Date().getFullYear()));
    expect(copy?.textContent).toContain("Rodrigo Erades");
    expect(copy?.textContent).toContain("Todos los derechos reservados.");
  });

  test("defaults to spanish when no lang prop is given", async () => {
    const result = await renderAstroComponent(Footer, { props: {} });
    expect(result.innerHTML).toContain("Navegación");
    expect(result.querySelector('a[href="/es/blog"]')).not.toBeNull();
  });

  test("renders localized nav links for each language", async () => {
    for (const lang of ["es", "en"] as const) {
      const result = await renderAstroComponent(Footer, { props: { lang } });
      for (const path of ["", "/blog", "/about", "/tags"]) {
        expect(
          result.querySelector(`a[href="/${lang}${path}"]`)
        ).not.toBeNull();
      }
    }
  });

  test("uses english translations for lang=en", async () => {
    const result = await renderAstroComponent(Footer, { props: { lang: "en" } });
    expect(result.innerHTML).toContain("All rights reserved.");
    expect(result.innerHTML).toContain("Navigation");
    expect(result.innerHTML).toContain("Follow me");
  });

  test("renders social links safely with accessible labels", async () => {
    const result = await renderAstroComponent(Footer, { props: { lang: "en" } });
    const social = [
      "https://www.linkedin.com/in/siete3/",
      "https://x.com/area_73",
    ];
    for (const href of social) {
      const link = result.querySelector(`a[href="${href}"]`);
      expect(link).not.toBeNull();
      expect(link?.getAttribute("target")).toBe("_blank");
      expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
      expect(link?.getAttribute("aria-label")).toBeTruthy();
    }
  });

  test("matches header container width and sticks to the bottom", async () => {
    const result = await renderAstroComponent(Footer, { props: { lang: "es" } });
    const footer = result.querySelector("footer");
    expect(footer?.classList.contains("border-t")).toBe(true);
    expect(footer?.classList.contains("mt-auto")).toBe(true);
    expect(footer?.querySelector(".max-w-\\[1440px\\]")).not.toBeNull();
  });
});
