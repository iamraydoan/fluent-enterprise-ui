import type { ReactNode } from "react";
import { expect } from "vitest";
import { render } from "vitest-browser-react";
import { FluentProvider } from "@/components/ui";
import { initI18n } from "@/i18n";
import { lightTheme } from "@/theme";

export async function renderWithAppTheme(ui: ReactNode) {
  localStorage.setItem("fluent-enterprise-ui:language", "en");
  await initI18n();
  return await render(<FluentProvider theme={lightTheme}>{ui}</FluentProvider>);
}

export function css(element: Element, property: string) {
  return getComputedStyle(element).getPropertyValue(property);
}

export function firstFieldRow() {
  const label = Array.from(document.querySelectorAll("span")).find((span) =>
    /^[^:]+:$/.test(span.textContent ?? ""),
  );
  if (!label) throw new Error("field label not found");
  const row = label.parentElement as HTMLElement;
  const card = row.parentElement as HTMLElement;
  return {
    label: label as HTMLElement,
    row,
    card,
    grid: card.parentElement as HTMLElement,
    header: card.children[0] as HTMLElement,
    headerText: (card.children[0] as HTMLElement).querySelector("span") as HTMLElement,
    value: row.children[1] as HTMLElement,
  };
}

export function expectDetailCardParity(labelWidth = 120) {
  const { label, row, card, grid, header, headerText, value } = firstFieldRow();
  expect(css(card, "padding")).toBe("8px 16px 0px");
  expect(css(card, "background-color")).toBe("rgb(250, 250, 250)");
  expect(css(card, "border-radius")).toBe("12px");
  expect(css(card, "margin-top")).toBe("10px");
  expect(css(card, "display")).toBe("flex");
  expect(css(card, "flex-direction")).toBe("column");
  expect(css(card, "row-gap")).toBe("12px");
  expect(css(grid, "row-gap")).toBe("12px");
  expect(css(grid, "column-gap")).toBe("12px");
  expect((grid as HTMLElement).style.gridTemplateColumns).toBe(
    "repeat(auto-fit, minmax(300px, 1fr))",
  );
  expect(css(header, "display")).toBe("flex");
  expect(css(header, "padding-bottom")).toBe("8px");
  expect(css(header, "border-bottom")).toBe("1px solid rgb(224, 224, 224)");
  expect(css(header, "margin-bottom")).toBe("12px");
  expect(css(headerText, "font-size")).toBe("16px");
  expect(css(headerText, "font-weight")).toBe("600");
  expect(css(headerText, "color")).toBe("rgb(36, 36, 36)");
  expect(css(row, "display")).toBe("flex");
  expect(css(row, "column-gap")).toBe("12px");
  expect(css(row, "font-size")).toBe("13px");
  expect(css(label, "color")).toBe("rgb(97, 97, 97)");
  expect(css(label, "min-width")).toBe(`${labelWidth}px`);
  expect(css(label, "font-size")).toBe("13px");
  expect(css(value, "font-size")).toBe("13px");
  expect(css(value, "color")).toBe("rgb(36, 36, 36)");
}
