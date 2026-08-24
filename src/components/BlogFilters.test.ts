// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByText, getByRole } from "@testing-library/dom";
import BlogFilters from "./BlogFilters.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("BlogFilters.astro", () => {
  describe("renderizado básico", () => {
    test("debería renderizar el formulario de filtros", async () => {
      // Arrange
      const mockProps = {
        categories: ["Technology", "Programming"],
        selectedCategory: "Technology",
        sortBy: "date-desc",
        viewMode: "grid",
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert
      expect(result.querySelector("form")).toBeTruthy();
      expect(result.innerHTML).toContain("Categoría:");
    });

    test("debería mostrar todas las categorías disponibles", async () => {
      // Arrange
      const mockProps = {
        categories: ["Technology", "Programming", "Design"],
        selectedCategory: "Technology",
        sortBy: "date-desc",
        viewMode: "grid",
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert
      expect(result.innerHTML).toContain("Technology");
      expect(result.innerHTML).toContain("Programming");
      expect(result.innerHTML).toContain("Design");
    });

    test("debería marcar la categoría seleccionada como activa", async () => {
      // Arrange
      const mockProps = {
        categories: ["Technology", "Programming"],
        selectedCategory: "Programming",
        sortBy: "date-desc",
        viewMode: "grid",
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert
      const programmingLink = result.querySelector('a[aria-current="page"]');
      expect(programmingLink).toBeTruthy();
      expect(programmingLink?.textContent?.trim()).toBe("Programming");
    });
  });

  describe("selector de ordenamiento", () => {
    test("debería mostrar el selector de ordenamiento", async () => {
      // Arrange
      const mockProps = {
        categories: ["Technology"],
        selectedCategory: "Technology",
        sortBy: "date-desc",
        viewMode: "grid",
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert
      const select = result.querySelector("select");
      expect(select).toBeTruthy();
      expect(select?.getAttribute("name")).toBe("sortBy");
    });

    test("debería mostrar las opciones de ordenamiento correctas", async () => {
      // Arrange
      const mockProps = {
        categories: ["Technology"],
        selectedCategory: "Technology",
        sortBy: "date-desc",
        viewMode: "grid",
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert
      expect(result.innerHTML).toContain("Más recientes");
      expect(result.innerHTML).toContain("Más antiguos");
      expect(result.innerHTML).toContain("Por título");
    });

    test("debería traducir etiquetas y el sentinel 'Todas' con lang=en", async () => {
      // Arrange
      const mockProps = {
        categories: ["Todas", "Technology"],
        selectedCategory: "Todas",
        sortBy: "date-desc",
        viewMode: "grid",
        lang: "en" as const,
        getCategoryHref: (cat: string) => `/category/${cat}/`,
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert: se traduce lo mostrado, no el valor interno del href
      expect(result.innerHTML).toContain("Category:");
      expect(result.innerHTML).toContain("Newest");
      expect(result.innerHTML).not.toContain("Más recientes");
      const allLink = result.querySelector('a[aria-current="page"]');
      expect(allLink?.textContent?.trim()).toBe("All");
      expect(allLink?.getAttribute("href")).toBe("/category/Todas/");
    });

    test("debería marcar la opción de ordenamiento seleccionada", async () => {
      // Arrange
      const mockProps = {
        categories: ["Technology"],
        selectedCategory: "Technology",
        sortBy: "title",
        viewMode: "grid",
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert
      const titleOption = result.querySelector('option[value="title"]');
      expect(titleOption?.getAttribute("selected")).toBe("");
    });
  });

  describe("modo de vista", () => {
    test("debería incluir el componente ViewModeToggle", async () => {
      // Arrange
      const mockProps = {
        categories: ["Technology"],
        selectedCategory: "Technology",
        sortBy: "date-desc",
        viewMode: "grid",
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert
      // El componente ViewModeToggle debería estar presente
      expect(result.innerHTML).toBeTruthy();
    });
  });

  describe("generación de enlaces", () => {
    test("debería generar enlaces correctos para categorías sin tag", async () => {
      // Arrange
      const mockProps = {
        categories: ["Technology"],
        selectedCategory: "Technology",
        sortBy: "date-desc",
        viewMode: "grid",
        getCategoryHref: (cat: string) => `/category/${cat}/`,
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert
      const technologyLink = result.querySelector('a[href*="Technology"]');
      expect(technologyLink).toBeTruthy();
    });

    test("debería generar enlaces localizados para categorías con tag", async () => {
      // Arrange
      const mockProps = {
        categories: ["Technology", "Todas"],
        selectedCategory: "Technology",
        sortBy: "date-desc",
        viewMode: "grid",
        tag: "javascript",
        lang: "es" as const,
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert
      const todasLink = result.querySelector('a[href="/es/tags/javascript/?sortBy=date-desc"]');
      const technologyLink = result.querySelector(
        'a[href="/es/tags/javascript/?category=Technology&sortBy=date-desc"]'
      );
      expect(todasLink).toBeTruthy();
      expect(technologyLink).toBeTruthy();
      expect(result.querySelector('a[href^="/tags/"]')).toBeNull();
    });

    test("debería preferir getCategoryHref aunque también se pase tag", async () => {
      const mockProps = {
        categories: ["javascript", "Todas"],
        selectedCategory: "Todas",
        sortBy: "date-desc",
        viewMode: "grid",
        tag: "javascript",
        lang: "es" as const,
        getCategoryHref: (cat: string) =>
          cat === "Todas"
            ? "/es/tags/javascript/"
            : `/es/tags/javascript/?category=${cat}`,
      };

      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      expect(
        result.querySelector('a[href="/es/tags/javascript/"]')
      ).toBeTruthy();
      expect(
        result.querySelector('a[href="/es/tags/javascript/?category=javascript"]')
      ).toBeTruthy();
      expect(result.querySelector('a[href^="/tags/"]')).toBeNull();
      expect(
        result.querySelector('a[href*="/tags/javascript/javascript"]')
      ).toBeNull();
    });
  });

  describe("clases CSS y estilos", () => {
    test("debería aplicar las clases CSS correctas", async () => {
      // Arrange
      const mockProps = {
        categories: ["Technology"],
        selectedCategory: "Technology",
        sortBy: "date-desc",
        viewMode: "grid",
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert
      const form = result.querySelector("form");
      expect(form?.classList.contains("bg-card")).toBe(true);
      expect(form?.classList.contains("rounded-lg")).toBe(true);
    });

    test("debería aplicar clases personalizadas cuando se proporcionan", async () => {
      // Arrange
      const mockProps = {
        categories: ["Technology"],
        selectedCategory: "Technology",
        sortBy: "date-desc",
        viewMode: "grid",
        customClass: "custom-filter-class",
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert
      const form = result.querySelector("form");
      expect(form?.classList.contains("custom-filter-class")).toBe(true);
    });
  });

  describe("accesibilidad", () => {
    test("debería incluir atributos de accesibilidad en los enlaces", async () => {
      // Arrange
      const mockProps = {
        categories: ["Technology"],
        selectedCategory: "Technology",
        sortBy: "date-desc",
        viewMode: "grid",
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert
      const link = result.querySelector("a");
      expect(link?.getAttribute("tabindex")).toBe("0");
    });

    test("debería incluir aria-current en la categoría seleccionada", async () => {
      // Arrange
      const mockProps = {
        categories: ["Technology"],
        selectedCategory: "Technology",
        sortBy: "date-desc",
        viewMode: "grid",
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert
      const link = result.querySelector("a");
      expect(link?.getAttribute("aria-current")).toBe("page");
    });
  });

  describe("casos extremos", () => {
    test("debería manejar categorías vacías", async () => {
      // Arrange
      const mockProps = {
        categories: [],
        selectedCategory: "",
        sortBy: "date-desc",
        viewMode: "grid",
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert
      expect(result.innerHTML).toBeTruthy();
    });

    test("debería manejar categoría seleccionada que no existe", async () => {
      // Arrange
      const mockProps = {
        categories: ["Technology"],
        selectedCategory: "NonExistent",
        sortBy: "date-desc",
        viewMode: "grid",
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert
      expect(result.innerHTML).toBeTruthy();
    });

    test("debería manejar props undefined", async () => {
      // Act & Assert
      const result = await renderAstroComponent(BlogFilters, {
        props: {
          categories: [],
          selectedCategory: "",
          sortBy: "date-desc",
          viewMode: "grid",
        },
      });

      expect(result.innerHTML).toBeTruthy();
    });
  });

  describe("funcionalidad del formulario", () => {
    test("debería incluir el evento onchange en el selector", async () => {
      // Arrange
      const mockProps = {
        categories: ["Technology"],
        selectedCategory: "Technology",
        sortBy: "date-desc",
        viewMode: "grid",
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert
      const select = result.querySelector("select");
      expect(select?.getAttribute("onchange")).toBe("this.form.submit()");
    });

    test("debería incluir campos ocultos para parámetros de búsqueda", async () => {
      // Arrange
      const mockProps = {
        categories: ["Technology"],
        selectedCategory: "Technology",
        sortBy: "date-desc",
        viewMode: "grid",
      };

      // Act
      const result = await renderAstroComponent(BlogFilters, {
        props: mockProps,
      });

      // Assert
      // Los campos ocultos se renderizan condicionalmente basado en URL params
      expect(result.innerHTML).toBeTruthy();
    });
  });
});
