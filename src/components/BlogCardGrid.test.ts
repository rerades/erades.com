// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByText, getByAltText } from "@testing-library/dom";
import BlogCardGrid from "./BlogCardGrid.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("BlogCardGrid.astro", () => {
  describe("renderizado básico", () => {
    test("debería renderizar una tarjeta de blog con título y contenido", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post Title",
        excerpt: "This is a test excerpt",
        pubDate: new Date("2023-01-01"),
        author: "Test Author",
        content:
          "This is the content of the post with enough words to calculate read time",
      };

      // Act
      const result = await renderAstroComponent(BlogCardGrid, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      expect(result.innerHTML).toContain("Test Post Title");
      expect(result.innerHTML).toContain("This is a test excerpt");
      expect(result.innerHTML).toContain("Test Author");
    });

    test("debería generar el enlace correcto para el post", async () => {
      // Arrange
      const mockPost = {
        id: "es/test-post",
        title: "Test Post",
      };

      // Act
      const result = await renderAstroComponent(BlogCardGrid, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      const link = result.querySelector("a");
      expect(link?.getAttribute("href")).toBe("/es/blog/test-post/");
    });

    test("debería calcular el tiempo de lectura correctamente", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post",
        content: "word ".repeat(500), // 500 palabras = 2 minutos
      };

      // Act
      const result = await renderAstroComponent(BlogCardGrid, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      expect(result.innerHTML).toContain("2 min de lectura");
    });
  });

  describe("manejo de imágenes", () => {
    test("debería mostrar la imagen hero cuando está disponible", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post",
        heroImage: "/test-image.jpg",
      };

      // Act
      const result = await renderAstroComponent(BlogCardGrid, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      const img = result.querySelector("img");
      expect(img?.getAttribute("src")).toBe("/test-image.jpg");
      expect(img?.getAttribute("alt")).toBe("Test Post");
    });

    test("debería manejar posts sin imagen hero", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post",
      };

      // Act
      const result = await renderAstroComponent(BlogCardGrid, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      const img = result.querySelector("img");
      expect(img).toBeNull();
    });
  });

  describe("categorías y tags", () => {
    test("debería mostrar categorías cuando están disponibles", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post",
        categories: ["Technology", "Programming"],
      };

      // Act
      const result = await renderAstroComponent(BlogCardGrid, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      expect(result.innerHTML).toContain("Technology");
      expect(result.innerHTML).toContain("Programming");
    });

    test("debería mostrar tags cuando están disponibles", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post",
        tags: ["javascript", "react"],
      };

      // Act
      const result = await renderAstroComponent(BlogCardGrid, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      expect(result.innerHTML).toContain("#javascript");
      expect(result.innerHTML).toContain("#react");
    });

    test("debería manejar posts sin categorías ni tags", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post",
      };

      // Act
      const result = await renderAstroComponent(BlogCardGrid, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      expect(result.innerHTML).not.toContain("data-then-marker");
    });
  });

  describe("estructura de datos anidada", () => {
    test("debería manejar posts con estructura de datos anidada", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        data: {
          title: "Nested Title",
          excerpt: "Nested excerpt",
          pubDate: new Date("2023-01-01"),
          author: "Nested Author",
          heroImage: "/nested-image.jpg",
          categories: ["Nested Category"],
          tags: ["nested-tag"],
        },
      };

      // Act
      const result = await renderAstroComponent(BlogCardGrid, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      expect(result.innerHTML).toContain("Nested Title");
      expect(result.innerHTML).toContain("Nested excerpt");
      expect(result.innerHTML).toContain("Nested Author");
      expect(result.innerHTML).toContain("Nested Category");
      expect(result.innerHTML).toContain("#nested-tag");
    });
  });

  describe("casos extremos", () => {
    test("debería manejar post con contenido vacío", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "",
        excerpt: "",
        author: "",
        content: "",
      };

      // Act
      const result = await renderAstroComponent(BlogCardGrid, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      expect(result.innerHTML).toContain("1 min de lectura");
    });

    test("debería manejar post con ID inválido", async () => {
      // Arrange
      const mockPost = {
        id: null,
        title: "Test Post",
      };

      // Act
      const result = await renderAstroComponent(BlogCardGrid, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      const link = result.querySelector("a");
      expect(link?.getAttribute("href")).toBe("/es/blog//");
    });

    test("debería manejar post undefined", async () => {
      // Act & Assert
      await expect(
        renderAstroComponent(BlogCardGrid, {
          props: { post: undefined, lang: "es", index: 0 },
        })
      ).rejects.toThrow();
    });
  });

  describe("accesibilidad", () => {
    test("debería incluir aria-label en el enlace", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post",
      };

      // Act
      const result = await renderAstroComponent(BlogCardGrid, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      const link = result.querySelector("a");
      expect(link?.getAttribute("aria-label")).toBe("grid-card");
    });

    test("debería incluir aria-label en el título", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post",
      };

      // Act
      const result = await renderAstroComponent(BlogCardGrid, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      const title = result.querySelector("h3");
      expect(title?.getAttribute("aria-label")).toBe("blog-card-title");
    });
  });
});
