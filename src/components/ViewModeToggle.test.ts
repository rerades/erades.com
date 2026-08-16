// @vitest-environment happy-dom
import { describe, test, expect } from "vitest";
import { getByText, getByTitle } from "@testing-library/dom";
import ViewModeToggle from "./ViewModeToggle.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("ViewModeToggle", () => {
  test("renders with grid view mode", async () => {
    const result = await renderAstroComponent(ViewModeToggle, {
      props: {
        viewMode: "grid",
      },
    });

    const container = result.querySelector("div");
    expect(container).not.toBeNull();
    expect(container?.classList.contains("flex")).toBe(true);
    expect(container?.classList.contains("items-center")).toBe(true);
    expect(container?.classList.contains("gap-1")).toBe(true);
    expect(container?.classList.contains("bg-secondary")).toBe(true);
    expect(container?.classList.contains("rounded-lg")).toBe(true);
    expect(container?.classList.contains("p-1")).toBe(true);
  });

  test("renders with list view mode", async () => {
    const result = await renderAstroComponent(ViewModeToggle, {
      props: {
        viewMode: "list",
      },
    });

    const container = result.querySelector("div");
    expect(container).not.toBeNull();
    expect(container?.classList.contains("flex")).toBe(true);
  });

  test("renders grid link with correct styling when active", async () => {
    const result = await renderAstroComponent(ViewModeToggle, {
      props: {
        viewMode: "grid",
      },
    });

    const gridLink = result.querySelector('a[title="Vista grid"]');
    expect(gridLink).not.toBeNull();
    expect(gridLink?.classList.contains("h-8")).toBe(true);
    expect(gridLink?.classList.contains("w-8")).toBe(true);
    expect(gridLink?.classList.contains("p-0")).toBe(true);
    expect(gridLink?.classList.contains("rounded-full")).toBe(true);
    expect(gridLink?.classList.contains("flex")).toBe(true);
    expect(gridLink?.classList.contains("items-center")).toBe(true);
    expect(gridLink?.classList.contains("justify-center")).toBe(true);
    expect(gridLink?.classList.contains("bg-primary")).toBe(true);
    expect(gridLink?.classList.contains("text-primary-foreground")).toBe(true);
  });

  test("renders grid link with inactive styling when not active", async () => {
    const result = await renderAstroComponent(ViewModeToggle, {
      props: {
        viewMode: "list",
      },
    });

    const gridLink = result.querySelector('a[title="Vista grid"]');
    expect(gridLink).not.toBeNull();
    expect(gridLink?.classList.contains("bg-transparent")).toBe(true);
    expect(gridLink?.classList.contains("text-muted-foreground")).toBe(true);
  });

  test("renders list link with correct styling when active", async () => {
    const result = await renderAstroComponent(ViewModeToggle, {
      props: {
        viewMode: "list",
      },
    });

    const listLink = result.querySelector('a[title="Vista lista"]');
    expect(listLink).not.toBeNull();
    expect(listLink?.classList.contains("h-8")).toBe(true);
    expect(listLink?.classList.contains("w-8")).toBe(true);
    expect(listLink?.classList.contains("p-0")).toBe(true);
    expect(listLink?.classList.contains("rounded-full")).toBe(true);
    expect(listLink?.classList.contains("flex")).toBe(true);
    expect(listLink?.classList.contains("items-center")).toBe(true);
    expect(listLink?.classList.contains("justify-center")).toBe(true);
    expect(listLink?.classList.contains("bg-primary")).toBe(true);
    expect(listLink?.classList.contains("text-primary-foreground")).toBe(true);
  });

  test("renders list link with inactive styling when not active", async () => {
    const result = await renderAstroComponent(ViewModeToggle, {
      props: {
        viewMode: "grid",
      },
    });

    const listLink = result.querySelector('a[title="Vista lista"]');
    expect(listLink).not.toBeNull();
    expect(listLink?.classList.contains("bg-transparent")).toBe(true);
    expect(listLink?.classList.contains("text-muted-foreground")).toBe(true);
  });

  test("renders both links", async () => {
    const result = await renderAstroComponent(ViewModeToggle, {
      props: {
        viewMode: "grid",
      },
    });

    const gridLink = result.querySelector('a[title="Vista grid"]');
    const listLink = result.querySelector('a[title="Vista lista"]');

    expect(gridLink).not.toBeNull();
    expect(listLink).not.toBeNull();
  });

  test("has correct link structure", async () => {
    const result = await renderAstroComponent(ViewModeToggle, {
      props: {
        viewMode: "list",
      },
    });

    const links = result.querySelectorAll("a");
    expect(links.length).toBe(2);

    links.forEach((link) => {
      expect(link?.classList.contains("h-8")).toBe(true);
      expect(link?.classList.contains("w-8")).toBe(true);
      expect(link?.classList.contains("p-0")).toBe(true);
      expect(link?.classList.contains("rounded-full")).toBe(true);
      expect(link?.classList.contains("flex")).toBe(true);
      expect(link?.classList.contains("items-center")).toBe(true);
      expect(link?.classList.contains("justify-center")).toBe(true);
    });
  });

  test("renders with grid view mode and correct active state", async () => {
    const result = await renderAstroComponent(ViewModeToggle, {
      props: {
        viewMode: "grid",
      },
    });

    const gridLink = result.querySelector('a[title="Vista grid"]');
    const listLink = result.querySelector('a[title="Vista lista"]');

    // Grid should be active
    expect(gridLink?.classList.contains("bg-primary")).toBe(true);
    expect(gridLink?.classList.contains("text-primary-foreground")).toBe(true);

    // List should be inactive
    expect(listLink?.classList.contains("bg-transparent")).toBe(true);
    expect(listLink?.classList.contains("text-muted-foreground")).toBe(true);
  });

  test("renders with list view mode and correct active state", async () => {
    const result = await renderAstroComponent(ViewModeToggle, {
      props: {
        viewMode: "list",
      },
    });

    const gridLink = result.querySelector('a[title="Vista grid"]');
    const listLink = result.querySelector('a[title="Vista lista"]');

    // Grid should be inactive
    expect(gridLink?.classList.contains("bg-transparent")).toBe(true);
    expect(gridLink?.classList.contains("text-muted-foreground")).toBe(true);

    // List should be active
    expect(listLink?.classList.contains("bg-primary")).toBe(true);
    expect(listLink?.classList.contains("text-primary-foreground")).toBe(true);
  });

  test("renders with invalid view mode", async () => {
    const result = await renderAstroComponent(ViewModeToggle, {
      props: {
        viewMode: "invalid",
      },
    });

    const container = result.querySelector("div");
    expect(container).not.toBeNull();
    expect(result.innerHTML).toBeTruthy();
  });

  test("has correct titles", async () => {
    const result = await renderAstroComponent(ViewModeToggle, {
      props: {
        viewMode: "grid",
      },
    });

    const gridLink = result.querySelector('a[title="Vista grid"]');
    const listLink = result.querySelector('a[title="Vista lista"]');

    expect(gridLink).not.toBeNull();
    expect(listLink).not.toBeNull();
  });

  test("translates titles and aria-labels with lang=en", async () => {
    const result = await renderAstroComponent(ViewModeToggle, {
      props: {
        viewMode: "grid",
        lang: "en" as const,
      },
    });

    const gridLink = result.querySelector('a[title="Grid view"]');
    const listLink = result.querySelector('a[title="List view"]');

    expect(gridLink?.getAttribute("aria-label")).toBe(
      "Switch to grid view (active)"
    );
    expect(listLink?.getAttribute("aria-label")).toBe("Switch to list view");
  });

  test("renders with empty view mode", async () => {
    const result = await renderAstroComponent(ViewModeToggle, {
      props: {
        viewMode: "",
      },
    });

    const container = result.querySelector("div");
    expect(container).not.toBeNull();
    expect(result.innerHTML).toBeTruthy();
  });

  test("has proper container styling", async () => {
    const result = await renderAstroComponent(ViewModeToggle, {
      props: {
        viewMode: "grid",
      },
    });

    const container = result.querySelector("div");
    expect(container?.classList.contains("flex")).toBe(true);
    expect(container?.classList.contains("items-center")).toBe(true);
    expect(container?.classList.contains("gap-1")).toBe(true);
    expect(container?.classList.contains("bg-secondary")).toBe(true);
    expect(container?.classList.contains("rounded-lg")).toBe(true);
    expect(container?.classList.contains("p-1")).toBe(true);
  });
});
