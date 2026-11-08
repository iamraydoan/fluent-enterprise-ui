import { expect, test } from "vitest";
import { Grid, HStack } from "@/components/common";
import { renderWithAppTheme } from "@/test-utils";

function gridElement() {
  return document.querySelector('[style*="grid-template-columns"]') as HTMLElement;
}

test("applies a theme-backed bottom margin", async () => {
  await renderWithAppTheme(
    <HStack mb="md">
      <span>row</span>
    </HStack>,
  );
  const row = document.querySelector('[style*="margin-bottom"]') as HTMLElement;
  expect(row.style.marginBottom).toBe("var(--spacingHorizontalM)");
});

test("expands the auto-fit preset with the default minimum column", async () => {
  await renderWithAppTheme(
    <Grid columns="auto-fit" gap="md">
      <span>tile</span>
    </Grid>,
  );
  const grid = gridElement();
  expect(grid.style.gridTemplateColumns).toBe("repeat(auto-fit, minmax(300px, 1fr))");
  expect(grid.style.gap).toBe("var(--spacingHorizontalM)");
});

test("expands the auto-fit preset with an explicit minimum column", async () => {
  await renderWithAppTheme(
    <Grid columns="auto-fit" minColumn={340}>
      <span>tile</span>
    </Grid>,
  );
  expect(gridElement().style.gridTemplateColumns).toBe("repeat(auto-fit, minmax(340px, 1fr))");
});

test("expands the auto-fill preset with an explicit minimum column", async () => {
  await renderWithAppTheme(
    <Grid columns="auto-fill" minColumn={90} gap="sm">
      <span>tile</span>
    </Grid>,
  );
  expect(gridElement().style.gridTemplateColumns).toBe("repeat(auto-fill, minmax(90px, 1fr))");
});

test("expands the main-aside preset with the default widths", async () => {
  await renderWithAppTheme(
    <Grid columns="main-aside" gap="md">
      <span>main</span>
      <span>aside</span>
    </Grid>,
  );
  expect(gridElement().style.gridTemplateColumns).toBe("3fr minmax(280px, 1fr)");
});

test("expands the main-aside preset with explicit widths", async () => {
  await renderWithAppTheme(
    <Grid columns="main-aside" mainFr={2} asideWidth={320} gap="md">
      <span>main</span>
      <span>aside</span>
    </Grid>,
  );
  expect(gridElement().style.gridTemplateColumns).toBe("2fr minmax(320px, 1fr)");
});

test("passes an explicit template through unchanged", async () => {
  await renderWithAppTheme(
    <Grid columns="repeat(2, minmax(0, 1fr))" gap="12px">
      <span>tile</span>
    </Grid>,
  );
  const grid = gridElement();
  expect(grid.style.gridTemplateColumns).toBe("repeat(2, minmax(0px, 1fr))");
  expect(grid.style.gap).toBe("12px");
});
