import { expect, test } from "vitest";
import { Grid } from "@/components/common";
import { renderWithAppTheme } from "@/test-utils";

function gridElement() {
  return document.querySelector('[style*="grid-template-columns"]') as HTMLElement;
}

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
