import type { ReactNode } from "react";
import { expect } from "vitest";
import { page } from "vitest/browser";
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

function cardElements() {
  return Array.from(document.querySelectorAll<HTMLElement>("div")).filter(
    (element) =>
      css(element, "background-color") === "rgb(250, 250, 250)" &&
      css(element, "border-radius") === "12px",
  );
}

function fieldRows(card: HTMLElement) {
  return Array.from(card.children).filter((child) => {
    const label = (child as HTMLElement).children[0] as HTMLElement | undefined;
    return label?.tagName === "SPAN" && /:$/.test(label.textContent ?? "");
  }) as HTMLElement[];
}

function metrics(element: HTMLElement, properties: string[]) {
  return Object.fromEntries(properties.map((property) => [property, css(element, property)]));
}

export function detailSnapshot() {
  const cards = cardElements();
  if (cards.length === 0) throw new Error("no detail cards found");
  return cards.map((card) => {
    const header = card.children[0] as HTMLElement;
    const hasHeader = css(header, "margin-bottom") === "12px";
    const grid = card.parentElement as HTMLElement;
    const isGrid = grid ? getComputedStyle(grid).display === "grid" : false;
    return {
      card: metrics(card, [
        "padding",
        "background-color",
        "border-radius",
        "margin-top",
        "display",
        "flex-direction",
        "row-gap",
      ]),
      header: hasHeader
        ? metrics(header, [
            "display",
            "align-items",
            "justify-content",
            "padding-bottom",
            "border-bottom",
            "margin-bottom",
          ])
        : null,
      headerText: hasHeader
        ? metrics(header.querySelector("span") as HTMLElement, [
            "font-size",
            "font-weight",
            "color",
          ])
        : null,
      grid: isGrid
        ? {
            ...metrics(grid, ["row-gap", "column-gap"]),
            inlineTemplate: grid.style.gridTemplateColumns,
            computedTemplate: getComputedStyle(grid).gridTemplateColumns,
          }
        : null,
      fields: fieldRows(card).map((row) => ({
        row: metrics(row, ["display", "column-gap", "font-size"]),
        label: metrics(row.children[0] as HTMLElement, ["color", "min-width", "font-size"]),
        value: metrics(row.children[1] as HTMLElement, ["font-size", "color"]),
      })),
    };
  });
}

function cardSnapshot() {
  try {
    return detailSnapshot();
  } catch {
    return null;
  }
}

function textsOf(value: unknown): string[] | null {
  if (!value || typeof value !== "object") return null;
  const texts = (value as { texts?: unknown }).texts;
  if (!Array.isArray(texts)) return null;
  const result: string[] = [];
  for (const entry of texts) {
    if (!Array.isArray(entry) || typeof entry[0] !== "string") return null;
    result.push(entry[0]);
  }
  return result;
}

function fingerprintOf(view: unknown): unknown {
  if (!view || typeof view !== "object") return undefined;
  return (view as { fingerprint?: unknown }).fingerprint;
}

function fixtureViews(fixture: unknown): Record<string, unknown> {
  if (!fixture || typeof fixture !== "object") return {};
  const record = fixture as Record<string, unknown>;
  const views = record.views;
  if (views && typeof views === "object" && !Array.isArray(views)) {
    return views as Record<string, unknown>;
  }
  return record;
}

function viewKey(button: HTMLElement) {
  return (button.textContent ?? "").trim() || "unknown";
}

function textSignature() {
  return Array.from(document.querySelectorAll<HTMLElement>("*"))
    .map((element) => {
      const own = Array.from(element.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent ?? "")
        .join("")
        .replace(/\s+/g, " ")
        .trim();
      return own === "" ? null : own.slice(0, 40);
    })
    .filter((text): text is string => text !== null);
}

async function waitForText(expected: string[] | null) {
  const target = expected === null ? null : JSON.stringify(expected);
  const deadline = Date.now() + 2000;
  let previous = "";
  while (Date.now() < deadline) {
    const current = JSON.stringify(textSignature());
    if (current === previous && (target === null || current === target)) return;
    previous = current;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
}

function markerAttribute(buttons: HTMLElement[]) {
  if (buttons.some((button) => button.hasAttribute("aria-selected"))) return "aria-selected";
  if (buttons.some((button) => button.hasAttribute("aria-current"))) return "aria-current";
  return null;
}

async function waitForMarker(button: HTMLElement, attribute: string | null) {
  if (attribute === null) return;
  const deadline = Date.now() + 1000;
  while (Date.now() < deadline) {
    const value = button.getAttribute(attribute);
    if (attribute === "aria-selected" ? value === "true" : value !== null) return;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

async function parkCursor() {
  await page.elementLocator(document.documentElement).hover({ position: { x: 1, y: 1 } });
}

async function captureSettled(produce: () => unknown, expected: unknown) {
  let captured = produce();
  if (expected === undefined) return captured;
  const target = JSON.stringify(expected);
  for (let attempt = 0; attempt < 2 && JSON.stringify(captured) !== target; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    captured = produce();
  }
  return captured;
}

function viewButtons() {
  return Array.from(document.querySelectorAll<HTMLElement>("aside button")).filter(
    (button) => !button.getAttribute("aria-label"),
  );
}

export async function capturePageViews(
  options: { includeDefault?: boolean; expected?: unknown } = {},
) {
  const expectedViews = fixtureViews(options.expected);
  const buttons = viewButtons();
  const marker = markerAttribute(buttons);
  const views: Record<string, unknown> = {};
  if (options.includeDefault) {
    const expectedView = expectedViews.default;
    await waitForText(textsOf(fingerprintOf(expectedView)));
    await parkCursor();
    views.default = await captureSettled(
      () => ({ snapshot: cardSnapshot(), fingerprint: pageFingerprint() }),
      expectedView,
    );
  }
  for (const button of buttons) {
    button.click();
    await waitForMarker(button, marker);
    const key = viewKey(button);
    const expectedView = expectedViews[key];
    await waitForText(textsOf(fingerprintOf(expectedView)));
    await parkCursor();
    views[key] = await captureSettled(
      () => ({ snapshot: cardSnapshot(), fingerprint: pageFingerprint() }),
      expectedView,
    );
  }
  return views;
}

export async function captureWalkViews(expected?: unknown) {
  const expectedViews = fixtureViews(expected);
  const sectionButtons = viewButtons();
  const tabButtons = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'));
  const buttons = sectionButtons.length > 0 ? sectionButtons : tabButtons;
  if (buttons.length === 0) {
    const expectedView = expectedViews.page;
    await waitForText(textsOf(expectedView));
    await parkCursor();
    return {
      walk: "page",
      views: { page: await captureSettled(() => pageFingerprint(), expectedView) },
    };
  }
  const marker = markerAttribute(buttons);
  const views: Record<string, unknown> = {};
  for (const button of buttons) {
    button.click();
    await waitForMarker(button, marker);
    const key = viewKey(button);
    const expectedView = expectedViews[key];
    await waitForText(textsOf(expectedView));
    await parkCursor();
    views[key] = await captureSettled(() => pageFingerprint(), expectedView);
  }
  return { walk: sectionButtons.length > 0 ? "sections" : "tabs", views };
}

export async function detailViews(expected?: unknown) {
  const expectedViews = fixtureViews(expected);
  const buttons = viewButtons();
  const marker = markerAttribute(buttons);
  const views: Record<string, unknown> = {};
  for (const button of buttons) {
    button.click();
    await waitForMarker(button, marker);
    const key = viewKey(button);
    await waitForText(null);
    await parkCursor();
    views[key] = await captureSettled(
      () => (cardElements().length === 0 ? null : detailSnapshot()),
      expectedViews[key],
    );
  }
  return views;
}

export async function expectDetailViews(expected: unknown) {
  expect(await detailViews(expected)).toEqual(expected);
}

export function expectDetailSnapshot(expected: unknown) {
  expect(detailSnapshot()).toEqual(expected);
}

export function pageFingerprint() {
  const box = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return [Math.round(rect.width), Math.round(rect.height)];
  };
  const texts = Array.from(document.querySelectorAll<HTMLElement>("*"))
    .map((element) => {
      const own = Array.from(element.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent ?? "")
        .join("")
        .replace(/\s+/g, " ")
        .trim();
      if (own === "") return null;
      const rect = element.getBoundingClientRect();
      return [
        own.slice(0, 40),
        Math.round(rect.left),
        Math.round(rect.top),
        css(element, "font-size"),
        css(element, "font-weight"),
        css(element, "color"),
      ];
    })
    .filter((entry) => entry !== null);
  const cards = Array.from(document.querySelectorAll<HTMLElement>("*"))
    .filter(
      (element) =>
        css(element, "border-radius") === "12px" &&
        css(element, "background-color") === "rgb(250, 250, 250)",
    )
    .map((element) => ({
      padding: css(element, "padding"),
      margin: css(element, "margin"),
      display: css(element, "display"),
      direction: css(element, "flex-direction"),
      rowGap: css(element, "row-gap"),
      columnGap: css(element, "column-gap"),
      overflow: css(element, "overflow"),
      shrink: css(element, "flex-shrink"),
      box: box(element),
    }));
  const grids = Array.from(document.querySelectorAll<HTMLElement>("*"))
    .filter((element) => css(element, "display") === "grid")
    .map((element) => ({
      inline: element.style.gridTemplateColumns,
      computed: css(element, "grid-template-columns"),
      rowGap: css(element, "row-gap"),
      columnGap: css(element, "column-gap"),
      box: box(element),
    }));
  return { cards, grids, texts };
}
