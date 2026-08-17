// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByText } from "@testing-library/dom";
import If from "./If.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("If.astro", () => {
  describe("cuando la condición es verdadera", () => {
    test("debería renderizar el contenido then cuando la condición es verdadera", async () => {
      // Arrange
      const thenContent = "<p>This is the then content</p>";
      const elseContent = "<p>This is the else content</p>";

      // Act
      const result = await renderAstroComponent(If, {
        props: { condition: true },
        slots: {
          then: thenContent,
          else: elseContent,
        },
      });

      // Assert
      expect(result.innerHTML).toContain("This is the then content");
      expect(result.innerHTML).not.toContain("This is the else content");
    });

    test("debería manejar contenido then con HTML complejo", async () => {
      // Arrange
      const thenContent = `<span class="test">Then with attributes</span>`;

      // Act
      const result = await renderAstroComponent(If, {
        props: { condition: true },
        slots: {
          then: thenContent,
        },
      });

      // Assert
      expect(result.innerHTML).toContain("Then with attributes");
      expect(result.innerHTML).toContain('class="test"');
    });

    test("debería manejar HTML anidado en el contenido then", async () => {
      // Arrange
      const thenContent = `<div class="nested"><p>Nested content</p><span>More content</span></div>`;

      // Act
      const result = await renderAstroComponent(If, {
        props: { condition: true },
        slots: {
          then: thenContent,
        },
      });

      // Assert
      expect(result.innerHTML).toContain("Nested content");
      expect(result.innerHTML).toContain("More content");
    });
  });

  describe("cuando la condición es falsa", () => {
    test("debería renderizar el contenido else cuando la condición es falsa", async () => {
      // Arrange
      const thenContent = "<p>This is the then content</p>";
      const elseContent = "<p>This is the else content</p>";

      // Act
      const result = await renderAstroComponent(If, {
        props: { condition: false },
        slots: {
          then: thenContent,
          else: elseContent,
        },
      });

      // Assert
      expect(result.innerHTML).toContain("This is the else content");
      expect(result.innerHTML).not.toContain("This is the then content");
    });

    test("debería manejar contenido else con HTML complejo", async () => {
      // Arrange
      const elseContent = `<span class="test">Else with attributes</span>`;

      // Act
      const result = await renderAstroComponent(If, {
        props: { condition: false },
        slots: {
          else: elseContent,
        },
      });

      // Assert
      expect(result.innerHTML).toContain("Else with attributes");
      expect(result.innerHTML).toContain('class="test"');
    });
  });

  describe("casos extremos", () => {
    test("debería manejar slot then faltante", async () => {
      // Arrange
      const elseContent = "<p>Else content only</p>";

      // Act
      const result = await renderAstroComponent(If, {
        props: { condition: true },
        slots: {
          else: elseContent,
        },
      });

      // Assert
      expect(result.innerHTML).toBe("");
    });

    test("debería manejar slot else faltante", async () => {
      // Arrange
      const thenContent = "<p>Then content only</p>";

      // Act
      const result = await renderAstroComponent(If, {
        props: { condition: false },
        slots: {
          then: thenContent,
        },
      });

      // Assert
      expect(result.innerHTML).toBe("");
    });

    test("debería manejar contenido vacío en los slots", async () => {
      // Act
      const result = await renderAstroComponent(If, {
        props: { condition: true },
        slots: {
          then: "",
          else: "",
        },
      });

      // Assert
      expect(result.innerHTML).toBe("");
    });

    test("debería renderizar correctamente cuando solo existe slot then", async () => {
      // Arrange
      const thenContent = "<p>Only then content</p>";

      // Act
      const result = await renderAstroComponent(If, {
        props: { condition: true },
        slots: {
          then: thenContent,
        },
      });

      // Assert
      expect(result.innerHTML).toContain("Only then content");
    });
  });

  describe("validación de props", () => {
    test("debería manejar condición booleana verdadera", async () => {
      // Arrange
      const thenContent = "<p>Content</p>";

      // Act
      const result = await renderAstroComponent(If, {
        props: { condition: true },
        slots: {
          then: thenContent,
        },
      });

      // Assert
      expect(result.innerHTML).toContain("Content");
    });

    test("debería manejar condición booleana falsa", async () => {
      // Arrange
      const elseContent = "<p>Content</p>";

      // Act
      const result = await renderAstroComponent(If, {
        props: { condition: false },
        slots: {
          else: elseContent,
        },
      });

      // Assert
      expect(result.innerHTML).toContain("Content");
    });

    test("debería funcionar con ambos slots presentes", async () => {
      // Arrange
      const thenContent = "<p>Then content</p>";
      const elseContent = "<p>Else content</p>";

      // Act - Condición verdadera
      const resultTrue = await renderAstroComponent(If, {
        props: { condition: true },
        slots: {
          then: thenContent,
          else: elseContent,
        },
      });

      // Act - Condición falsa
      const resultFalse = await renderAstroComponent(If, {
        props: { condition: false },
        slots: {
          then: thenContent,
          else: elseContent,
        },
      });

      // Assert
      expect(resultTrue.innerHTML).toContain("Then content");
      expect(resultTrue.innerHTML).not.toContain("Else content");
      expect(resultFalse.innerHTML).toContain("Else content");
      expect(resultFalse.innerHTML).not.toContain("Then content");
    });
  });
});
