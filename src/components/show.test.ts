// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByText } from "@testing-library/dom";
import ShowWhen from "./ShowWhen.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("ShowWhen", () => {
  test("renders children when condition is true", async () => {
    const result = await renderAstroComponent(ShowWhen, {
      props: {
        when: true,
      },
      slots: {
        default: "Test Content",
      },
    });

    const content = getByText(result, "Test Content");
    expect(content).not.toBeNull();
  });

  test("does not render children when condition is false", async () => {
    const result = await renderAstroComponent(ShowWhen, {
      props: {
        when: false,
      },
      slots: {
        default: "Test Content",
      },
    });

    // When condition is false, no content should be rendered
    expect(result.textContent).not.toContain("Test Content");
  });

  test("does not render children when condition is null", async () => {
    const result = await renderAstroComponent(ShowWhen, {
      props: {
        when: null,
      },
      slots: {
        default: "Test Content",
      },
    });

    // When condition is null, no content should be rendered
    expect(result.textContent).not.toContain("Test Content");
  });

  test("does not render children when condition is undefined", async () => {
    const result = await renderAstroComponent(ShowWhen, {
      props: {
        when: undefined,
      },
      slots: {
        default: "Test Content",
      },
    });

    // When condition is undefined, no content should be rendered
    expect(result.textContent).not.toContain("Test Content");
  });

  test("renders children when condition is a non-empty string", async () => {
    const result = await renderAstroComponent(ShowWhen, {
      props: {
        when: "hello",
      },
      slots: {
        default: "Test Content",
      },
    });

    const content = getByText(result, "Test Content");
    expect(content).not.toBeNull();
  });

  test("renders children when condition is a non-empty array", async () => {
    const result = await renderAstroComponent(ShowWhen, {
      props: {
        when: [1, 2, 3],
      },
      slots: {
        default: "Test Content",
      },
    });

    const content = getByText(result, "Test Content");
    expect(content).not.toBeNull();
  });

  test("does not render children when condition is an empty array", async () => {
    const result = await renderAstroComponent(ShowWhen, {
      props: {
        when: [],
      },
      slots: {
        default: "Test Content",
      },
    });

    // When condition is an empty array, no content should be rendered
    expect(result.textContent).not.toContain("Test Content");
  });

  test("renders children when condition is a non-zero number", async () => {
    const result = await renderAstroComponent(ShowWhen, {
      props: {
        when: 42,
      },
      slots: {
        default: "Test Content",
      },
    });

    const content = getByText(result, "Test Content");
    expect(content).not.toBeNull();
  });

  test("does not render children when condition is zero", async () => {
    const result = await renderAstroComponent(ShowWhen, {
      props: {
        when: 0,
      },
      slots: {
        default: "Test Content",
      },
    });

    // When condition is zero, no content should be rendered
    expect(result.textContent).not.toContain("Test Content");
  });

  test("renders complex HTML content when condition is true", async () => {
    const result = await renderAstroComponent(ShowWhen, {
      props: {
        when: true,
      },
      slots: {
        default: "<div><h1>Title</h1><p>Paragraph</p></div>",
      },
    });

    const title = getByText(result, "Title");
    const paragraph = getByText(result, "Paragraph");
    expect(title).not.toBeNull();
    expect(paragraph).not.toBeNull();
  });

  test("handles edge case with empty string condition", async () => {
    const result = await renderAstroComponent(ShowWhen, {
      props: {
        when: "",
      },
      slots: {
        default: "Test Content",
      },
    });

    // Empty string should be falsy, so no content should be rendered
    expect(result.textContent).not.toContain("Test Content");
  });

  test("handles edge case with object condition", async () => {
    const result = await renderAstroComponent(ShowWhen, {
      props: {
        when: { key: "value" },
      },
      slots: {
        default: "Test Content",
      },
    });

    // Objects should be truthy, so content should be rendered
    const content = getByText(result, "Test Content");
    expect(content).not.toBeNull();
  });

  test("handles edge case with function condition", async () => {
    const result = await renderAstroComponent(ShowWhen, {
      props: {
        when: () => true,
      },
      slots: {
        default: "Test Content",
      },
    });

    // Functions should be truthy, so content should be rendered
    const content = getByText(result, "Test Content");
    expect(content).not.toBeNull();
  });
});
