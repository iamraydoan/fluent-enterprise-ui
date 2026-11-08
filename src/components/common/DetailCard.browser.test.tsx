import { expect, test } from "vitest";
import { DetailCard, DetailField } from "@/components/common";
import { renderWithAppTheme } from "@/test-utils";

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
  expect(getComputedStyle(label).minWidth).toBe("120px");
  expect(getComputedStyle(label).color).toBe("rgb(97, 97, 97)");
  expect(getComputedStyle(label).fontSize).toBe("13px");
  expect(getComputedStyle(row).columnGap).toBe("12px");
});
