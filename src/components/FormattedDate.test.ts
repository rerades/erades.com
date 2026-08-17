// @vitest-environment ./src/test/happy-dom-ssr.ts
import { describe, test, expect } from "vitest";
import { getByText } from "@testing-library/dom";
import FormattedDate from "./FormattedDate.astro";
import { renderAstroComponent } from "../test/helpers.ts";

describe("FormattedDate", () => {
  test("formats valid date correctly", async () => {
    const testDate = new Date("2023-01-15");

    const result = await renderAstroComponent(FormattedDate, {
      props: {
        date: testDate,
      },
    });

    const timeElement = result.querySelector("time");
    expect(timeElement).not.toBeNull();
    expect(timeElement?.getAttribute("datetime")).toBe(
      "2023-01-15T00:00:00.000Z"
    );

    // Verificar que el texto formateado está presente
    const formattedText = getByText(result, "January 15, 2023");
    expect(formattedText).not.toBeNull();
  });

  test("handles invalid date", async () => {
    const invalidDate = new Date("invalid");

    const result = await renderAstroComponent(FormattedDate, {
      props: {
        date: invalidDate,
      },
    });

    const timeElement = result.querySelector("time");
    expect(timeElement).not.toBeNull();
    expect(timeElement?.getAttribute("datetime")).toBeNull();

    // Verificar que muestra "-" para fechas inválidas
    const dashText = getByText(result, "-");
    expect(dashText).not.toBeNull();
  });

  test("handles null date", async () => {
    const nullDate = null as any;

    const result = await renderAstroComponent(FormattedDate, {
      props: {
        date: nullDate,
      },
    });

    const timeElement = result.querySelector("time");
    expect(timeElement).not.toBeNull();
    expect(timeElement?.getAttribute("datetime")).toBeNull();

    const dashText = getByText(result, "-");
    expect(dashText).not.toBeNull();
  });

  test("handles undefined date", async () => {
    const undefinedDate = undefined as any;

    const result = await renderAstroComponent(FormattedDate, {
      props: {
        date: undefinedDate,
      },
    });

    const timeElement = result.querySelector("time");
    expect(timeElement).not.toBeNull();
    expect(timeElement?.getAttribute("datetime")).toBeNull();

    const dashText = getByText(result, "-");
    expect(dashText).not.toBeNull();
  });

  test("formats different date formats", async () => {
    const dates = [
      { date: new Date("2023-12-25"), expected: "December 25, 2023" },
      { date: new Date("2023-06-01"), expected: "June 1, 2023" },
      { date: new Date("2023-03-08"), expected: "March 8, 2023" },
    ];

    for (const { date, expected } of dates) {
      const result = await renderAstroComponent(FormattedDate, {
        props: {
          date,
        },
      });

      const formattedText = getByText(result, expected);
      expect(formattedText).not.toBeNull();
    }
  });

  test("includes datetime attribute for valid dates", async () => {
    const testDate = new Date("2023-01-15T10:30:00.000Z");

    const result = await renderAstroComponent(FormattedDate, {
      props: {
        date: testDate,
      },
    });

    const timeElement = result.querySelector("time");
    expect(timeElement?.getAttribute("datetime")).toBe(
      "2023-01-15T10:30:00.000Z"
    );
  });
});
