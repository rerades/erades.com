// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByText, getByAltText } from "@testing-library/dom";
import BlogCardList from "./BlogCardList.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("BlogCardList.astro", () => {
  describe("renderizado básico", () => {
    test("debería renderizar una tarjeta de lista con título y contenido", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post Title",
        excerpt: "This is a test excerpt",
        pubDate: new Date("2023-01-01"),
        author: "Test Author",
      };

      // Act
      const result = await renderAstroComponent(BlogCardList, {
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
      const result = await renderAstroComponent(BlogCardList, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      const link = result.querySelector("a");
      expect(link?.getAttribute("href")).toBe("/es/blog/test-post/");
    });

    test("debería mostrar la categoría cuando está disponible", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post",
        categories: ["Technology", "Programming"],
      };

      // Act
      const result = await renderAstroComponent(BlogCardList, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      expect(result.innerHTML).toContain("Technology");
    });

    test("debería mostrar 'Sin categoría' cuando no hay categorías", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post",
      };

      // Act
      const result = await renderAstroComponent(BlogCardList, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      expect(result.innerHTML).toContain("Sin categoría");
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
      const result = await renderAstroComponent(BlogCardList, {
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
      const result = await renderAstroComponent(BlogCardList, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      const img = result.querySelector("img");
      expect(img).toBeNull();
    });
  });

  describe("tags", () => {
    test("debería mostrar tags cuando están disponibles", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post",
        tags: ["javascript", "react"],
      };

      // Act
      const result = await renderAstroComponent(BlogCardList, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      expect(result.innerHTML).toContain("#javascript");
      expect(result.innerHTML).toContain("#react");
    });

    test("debería manejar posts sin tags", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post",
      };

      // Act
      const result = await renderAstroComponent(BlogCardList, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      expect(result.innerHTML).not.toContain("#");
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
      const result = await renderAstroComponent(BlogCardList, {
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

  describe("layout y estructura", () => {
    test("debería tener la estructura de grid correcta", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post",
      };

      // Act
      const result = await renderAstroComponent(BlogCardList, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      const grid = result.querySelector(".grid");
      expect(grid?.classList.contains("md:grid-cols-4")).toBe(true);
    });

    test("debería tener las clases CSS correctas", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post",
      };

      // Act
      const result = await renderAstroComponent(BlogCardList, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      const link = result.querySelector("a");
      expect(link?.classList.contains("block")).toBe(true);
      expect(link?.classList.contains("group")).toBe(true);
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
      };

      // Act
      const result = await renderAstroComponent(BlogCardList, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      expect(result.innerHTML).toBeTruthy();
    });

    test("debería manejar post con ID inválido", async () => {
      // Arrange
      const mockPost = {
        id: null,
        title: "Test Post",
      };

      // Act
      const result = await renderAstroComponent(BlogCardList, {
        props: { post: mockPost, lang: "es" },
      });

      // Assert
      const link = result.querySelector("a");
      expect(link?.getAttribute("href")).toBe("/es/blog//");
    });

    test("debería manejar post undefined", async () => {
      // Act & Assert
      await expect(
        renderAstroComponent(BlogCardList, {
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
      const result = await renderAstroComponent(BlogCardList, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      const link = result.querySelector("a");
      expect(link?.getAttribute("aria-label")).toBe("list-card");
    });

    test("debería incluir aria-label en el título", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post",
      };

      // Act
      const result = await renderAstroComponent(BlogCardList, {
        props: { post: mockPost, lang: "es", index: 0 },
      });

      // Assert
      const title = result.querySelector("h3");
      expect(title?.getAttribute("aria-label")).toBe("blog-card-title");
    });
  });

  describe("fecha de publicación", () => {
    test("debería mostrar la fecha de publicación correctamente", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post",
        pubDate: new Date("2023-01-15"),
      };

      // Act
      const result = await renderAstroComponent(BlogCardList, {
        props: { post: mockPost, lang: "es" },
      });

      // Assert
      expect(result.innerHTML).toContain("15 de enero de 2023");
    });

    test("debería manejar fecha de publicación inválida", async () => {
      // Arrange
      const mockPost = {
        id: "test-post",
        title: "Test Post",
        pubDate: "invalid-date",
      };

      // Act
      const result = await renderAstroComponent(BlogCardList, {
        props: { post: mockPost, lang: "es" },
      });

      // Assert
      expect(result.innerHTML).toBeTruthy();
    });
  });
});
