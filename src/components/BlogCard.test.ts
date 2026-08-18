// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByText, getByRole, getAllByText } from "@testing-library/dom";
import BlogCard from "./BlogCard.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("BlogCard", () => {
  const mockPost = {
    id: "test-post",
    title: "Test Post Title",
    description: "Test post description",
    excerpt: "Test post excerpt",
    pubDate: new Date("2023-01-01"),
    author: "Test Author",
    categories: ["Test Category"],
    tags: ["test", "blog"],
    heroImage: "/test-image.jpg",
  };

  test("renders grid variant by default", async () => {
    const result = await renderAstroComponent(BlogCard, {
      props: {
        post: mockPost,
        lang: "en",
        index: 0,
      },
    });

    // Verificar que se renderiza como grid (debería tener la clase específica de grid)
    const link = result.querySelector('a[aria-label="grid-card"]');
    expect(link).not.toBeNull();
  });

  test("renders grid variant explicitly", async () => {
    const result = await renderAstroComponent(BlogCard, {
      props: {
        post: mockPost,
        variant: "grid",
        lang: "en",
        index: 0,
      },
    });

    const link = result.querySelector('a[aria-label="grid-card"]');
    expect(link).not.toBeNull();
  });

  test("renders list variant", async () => {
    const result = await renderAstroComponent(BlogCard, {
      props: {
        post: mockPost,
        variant: "list",
        lang: "en",
        index: 0,
      },
    });

    const link = result.querySelector('a[aria-label="list-card"]');
    expect(link).not.toBeNull();
  });

  test("renders post title in grid variant", async () => {
    const result = await renderAstroComponent(BlogCard, {
      props: {
        post: mockPost,
        variant: "grid",
        lang: "en",
        index: 0,
      },
    });

    const title = getByText(result, "Test Post Title");
    expect(title).not.toBeNull();
  });

  test("renders post title in list variant", async () => {
    const result = await renderAstroComponent(BlogCard, {
      props: {
        post: mockPost,
        variant: "list",
        lang: "en",
        index: 0,
      },
    });

    const title = getByText(result, "Test Post Title");
    expect(title).not.toBeNull();
  });

  test("renders categories in grid variant", async () => {
    const result = await renderAstroComponent(BlogCard, {
      props: {
        post: mockPost,
        variant: "grid",
        lang: "en",
        index: 0,
      },
    });

    const category = getByText(result, "Test Category");
    expect(category).not.toBeNull();
  });

  test("renders author in both variants", async () => {
    // Test grid variant
    const gridResult = await renderAstroComponent(BlogCard, {
      props: {
        post: mockPost,
        variant: "grid",
        lang: "en",
        index: 0,
      },
    });

    const gridAuthors = getAllByText(gridResult, (content, element) => {
      return element?.textContent?.includes("Test Author") || false;
    });
    expect(gridAuthors.length).toBeGreaterThan(0);

    // Test list variant
    const listResult = await renderAstroComponent(BlogCard, {
      props: {
        post: mockPost,
        variant: "list",
        lang: "en",
        index: 0,
      },
    });

    const listAuthors = getAllByText(listResult, (content, element) => {
      return element?.textContent?.includes("Test Author") || false;
    });
    expect(listAuthors.length).toBeGreaterThan(0);
  });

  test("renders hero image when available", async () => {
    const result = await renderAstroComponent(BlogCard, {
      props: {
        post: mockPost,
        variant: "grid",
        lang: "en",
        index: 0,
      },
    });

    const image = result.querySelector('img[src="/test-image.jpg"]');
    expect(image).not.toBeNull();
    expect(image?.getAttribute("alt")).toBe("Test Post Title");
  });

  test("handles post without hero image", async () => {
    const postWithoutImage = { ...mockPost, heroImage: undefined };

    const result = await renderAstroComponent(BlogCard, {
      props: {
        post: postWithoutImage,
        variant: "grid",
        lang: "en",
        index: 0,
      },
    });

    // El componente debería renderizar sin errores
    const title = getByText(result, "Test Post Title");
    expect(title).not.toBeNull();
  });

  test("generates correct href for post", async () => {
    const result = await renderAstroComponent(BlogCard, {
      props: {
        post: mockPost,
        variant: "grid",
        lang: "en",
        index: 0,
      },
    });

    const link = result.querySelector("a");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe("/en/blog/test-post/");
  });
});
