import { expect, test } from "vitest";
import { DetailCard, DetailField } from "@/components/common";
import { css, renderWithAppTheme } from "@/test-utils";

test("renders a title and children", async () => {
  const screen = await renderWithAppTheme(
    <DetailCard title="Area">
      <span>child content</span>
    </DetailCard>,
  );
  await expect.element(screen.getByText("Area")).toBeVisible();
  await expect.element(screen.getByText("child content")).toBeVisible();
});

test("renders children without a title", async () => {
  const screen = await renderWithAppTheme(
    <DetailCard>
      <span>only children</span>
    </DetailCard>,
  );
  await expect.element(screen.getByText("only children")).toBeVisible();
  expect(document.querySelectorAll("section")).toHaveLength(0);
});

test("renders a custom header row instead of a title", async () => {
  const screen = await renderWithAppTheme(
    <DetailCard header={<span>custom header</span>}>
      <span>body</span>
    </DetailCard>,
  );
  await expect.element(screen.getByText("custom header")).toBeVisible();
  const headerRow = document.querySelector("span")?.parentElement as HTMLElement;
  expect(css(headerRow, "display")).toBe("flex");
  expect(css(headerRow, "margin-bottom")).toBe("12px");
  expect(css(headerRow, "justify-content")).toBe("space-between");
});

test("can render a header row with no bottom gap", async () => {
  const screen = await renderWithAppTheme(
    <DetailCard header={<span>tight header</span>} headerGap="none">
      <span>body</span>
    </DetailCard>,
  );
  await expect.element(screen.getByText("tight header")).toBeVisible();
  const headerRow = document.querySelector("span")?.parentElement as HTMLElement;
  expect(css(headerRow, "margin-bottom")).toBe("0px");
});

test("renders a label and value row", async () => {
  const screen = await renderWithAppTheme(
    <DetailCard title="Area">
      <DetailField label="Name" value="Mixing" />
    </DetailCard>,
  );
  await expect.element(screen.getByText("Name:")).toBeVisible();
  const label = Array.from(document.querySelectorAll("span")).find(
    (span) => span.textContent === "Name:",
  ) as HTMLElement;
  const row = label.parentElement as HTMLElement;
  const value = row.children[1] as HTMLElement;
  expect(value.textContent).toBe("Mixing");
  expect(css(label, "min-width")).toBe("120px");
  expect(css(label, "color")).toBe("rgb(97, 97, 97)");
  expect(css(label, "font-size")).toBe("13px");
  expect(css(row, "column-gap")).toBe("12px");
});

test("renders a wider label when asked", async () => {
  const screen = await renderWithAppTheme(
    <DetailCard title="Area">
      <DetailField label="Name" value="Mixing" labelWidth={170} />
    </DetailCard>,
  );
  await expect.element(screen.getByText("Name:")).toBeVisible();
  const label = Array.from(document.querySelectorAll("span")).find(
    (span) => span.textContent === "Name:",
  ) as HTMLElement;
  expect(css(label, "min-width")).toBe("170px");
});
