// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByText, getByRole, getByLabelText } from "@testing-library/dom";
import SocialProfileMenu from "./SocialProfileMenu.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("SocialProfileMenu", () => {
  test("renders with correct structure", async () => {
    const result = await renderAstroComponent(SocialProfileMenu, {
      props: {
        name: "John Doe",
        email: "john@example.com",
        linkedinUrl: "https://linkedin.com/in/johndoe",
        xUrl: "https://x.com/johndoe",
        lang: "es",
      },
    });

    const menu = result.querySelector("#avatar-menu");
    expect(menu).not.toBeNull();
    expect(menu?.classList.contains("hidden")).toBe(true);
    expect(menu?.classList.contains("absolute")).toBe(true);
    expect(menu?.classList.contains("right-0")).toBe(true);
  });

  test("renders user information", async () => {
    const result = await renderAstroComponent(SocialProfileMenu, {
      props: {
        name: "Jane Smith",
        email: "jane@example.com",
        linkedinUrl: "https://linkedin.com/in/janesmith",
        xUrl: "https://x.com/janesmith",
        lang: "en",
      },
    });

    const nameElement = getByText(result, "Jane Smith");
    const emailElement = getByText(result, "jane@example.com");

    expect(nameElement).not.toBeNull();
    expect(emailElement).not.toBeNull();
    expect(nameElement?.classList.contains("text-sm")).toBe(true);
    expect(nameElement?.classList.contains("font-medium")).toBe(true);
    expect(emailElement?.classList.contains("text-xs")).toBe(true);
    expect(emailElement?.classList.contains("text-muted-foreground")).toBe(
      true
    );
  });

  test("renders LinkedIn link", async () => {
    const result = await renderAstroComponent(SocialProfileMenu, {
      props: {
        name: "Test User",
        email: "test@example.com",
        linkedinUrl: "https://linkedin.com/in/testuser",
        xUrl: "https://x.com/testuser",
        lang: "es",
      },
    });

    const linkedinLink = getByText(result, "LinkedIn");
    expect(linkedinLink).not.toBeNull();
    expect(linkedinLink?.tagName).toBe("A");
    expect(linkedinLink?.getAttribute("href")).toBe(
      "https://linkedin.com/in/testuser"
    );
    expect(linkedinLink?.getAttribute("target")).toBe("_blank");
    expect(linkedinLink?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  test("renders X link", async () => {
    const result = await renderAstroComponent(SocialProfileMenu, {
      props: {
        name: "Test User",
        email: "test@example.com",
        linkedinUrl: "https://linkedin.com/in/testuser",
        xUrl: "https://x.com/testuser",
        lang: "en",
      },
    });

    const xLink = getByText(result, "X");
    expect(xLink).not.toBeNull();
    expect(xLink?.tagName).toBe("A");
    expect(xLink?.getAttribute("href")).toBe("https://x.com/testuser");
    expect(xLink?.getAttribute("target")).toBe("_blank");
    expect(xLink?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  test("has correct styling classes", async () => {
    const result = await renderAstroComponent(SocialProfileMenu, {
      props: {
        name: "Test User",
        email: "test@example.com",
        linkedinUrl: "https://linkedin.com/in/testuser",
        xUrl: "https://x.com/testuser",
        lang: "es",
      },
    });

    const menu = result.querySelector("#avatar-menu");
    expect(menu?.classList.contains("w-56")).toBe(true);
    expect(menu?.classList.contains("rounded-md")).toBe(true);
    expect(menu?.classList.contains("shadow-lg")).toBe(true);
    expect(menu?.classList.contains("bg-white")).toBe(true);
    expect(menu?.classList.contains("dark:bg-gray-900")).toBe(true);
    expect(menu?.classList.contains("border")).toBe(true);
    expect(menu?.classList.contains("border-gray-200")).toBe(true);
    expect(menu?.classList.contains("dark:border-gray-700")).toBe(true);
  });

  test("renders with long email", async () => {
    const result = await renderAstroComponent(SocialProfileMenu, {
      props: {
        name: "Test User",
        email: "very.long.email.address@very.long.domain.example.com",
        linkedinUrl: "https://linkedin.com/in/testuser",
        xUrl: "https://x.com/testuser",
        lang: "en",
      },
    });

    const emailElement = getByText(
      result,
      "very.long.email.address@very.long.domain.example.com"
    );
    expect(emailElement).not.toBeNull();
    expect(emailElement?.classList.contains("truncate")).toBe(true);
  });

  test("renders with special characters in name", async () => {
    const result = await renderAstroComponent(SocialProfileMenu, {
      props: {
        name: "José María",
        email: "jose@example.com",
        linkedinUrl: "https://linkedin.com/in/jose",
        xUrl: "https://x.com/jose",
        lang: "es",
      },
    });

    const nameElement = getByText(result, "José María");
    expect(nameElement).not.toBeNull();
  });

  test("has correct link structure", async () => {
    const result = await renderAstroComponent(SocialProfileMenu, {
      props: {
        name: "Test User",
        email: "test@example.com",
        linkedinUrl: "https://linkedin.com/in/testuser",
        xUrl: "https://x.com/testuser",
        lang: "en",
      },
    });

    const links = result.querySelectorAll("a");
    expect(links.length).toBe(2);

    links.forEach((link) => {
      expect(link?.classList.contains("flex")).toBe(true);
      expect(link?.classList.contains("items-center")).toBe(true);
      expect(link?.classList.contains("gap-2")).toBe(true);
      expect(link?.classList.contains("px-4")).toBe(true);
      expect(link?.classList.contains("py-2")).toBe(true);
      expect(link?.classList.contains("text-sm")).toBe(true);
      expect(link?.classList.contains("text-foreground")).toBe(true);
      expect(link?.classList.contains("hover:bg-muted")).toBe(true);
      expect(link?.classList.contains("transition-colors")).toBe(true);
      expect(link?.classList.contains("font-medium")).toBe(true);
    });
  });

  test("renders with different languages", async () => {
    const result = await renderAstroComponent(SocialProfileMenu, {
      props: {
        name: "Test User",
        email: "test@example.com",
        linkedinUrl: "https://linkedin.com/in/testuser",
        xUrl: "https://x.com/testuser",
        lang: "en",
      },
    });

    // Verificar que el componente se renderiza correctamente con lang="en"
    expect(result.innerHTML).toBeTruthy();
  });

  test("has proper accessibility attributes", async () => {
    const result = await renderAstroComponent(SocialProfileMenu, {
      props: {
        name: "Test User",
        email: "test@example.com",
        linkedinUrl: "https://linkedin.com/in/testuser",
        xUrl: "https://x.com/testuser",
        lang: "es",
      },
    });

    const links = result.querySelectorAll("a");
    links.forEach((link) => {
      expect(link?.hasAttribute("aria-label")).toBe(true);
      expect(link?.hasAttribute("title")).toBe(true);
    });
  });

  test("renders with empty strings", async () => {
    const result = await renderAstroComponent(SocialProfileMenu, {
      props: {
        name: "",
        email: "",
        linkedinUrl: "https://linkedin.com/in/testuser",
        xUrl: "https://x.com/testuser",
        lang: "en",
      },
    });

    const menu = result.querySelector("#avatar-menu");
    expect(menu).not.toBeNull();
    expect(result.innerHTML).toBeTruthy();
  });
});
