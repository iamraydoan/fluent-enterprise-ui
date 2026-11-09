import { expect, test } from "vitest";
import { DetailSurface } from "@/components/common";
import { css, renderWithAppTheme } from "@/test-utils";

function surfaceOf(screen: Awaited<ReturnType<typeof renderWithAppTheme>>, text: string) {
  return screen.getByText(text).element().parentElement as HTMLElement;
}

test("renders the card surface with content-card metrics", async () => {
  const screen = await renderWithAppTheme(
    <DetailSurface>
      <span>surface child</span>
    </DetailSurface>,
  );
  await expect.element(screen.getByText("surface child")).toBeVisible();
  const surface = surfaceOf(screen, "surface child");
  expect(css(surface, "padding")).toBe("8px 16px 0px");
  expect(css(surface, "background-color")).toBe("rgb(250, 250, 250)");
  expect(css(surface, "border-radius")).toBe("12px");
  expect(css(surface, "margin-top")).toBe("10px");
  expect(css(surface, "display")).toBe("flex");
  expect(css(surface, "flex-direction")).toBe("column");
  expect(css(surface, "row-gap")).toBe("normal");
});

test("emits no gap, so row and column gaps stay normal while the surface moves", async () => {
  const screen = await renderWithAppTheme(
    <DetailSurface p="lg" minHeight={300}>
      <span>gap child</span>
    </DetailSurface>,
  );
  await expect.element(screen.getByText("gap child")).toBeVisible();
  const surface = surfaceOf(screen, "gap child");
  expect(css(surface, "row-gap")).toBe("normal");
  expect(css(surface, "column-gap")).toBe("normal");
  expect(surface.style.gap).toBe("");
  expect(css(surface, "display")).toBe("flex");
});

test("accepts padding as a scale name and as a number", async () => {
  const scale = await renderWithAppTheme(
    <DetailSurface p="lg">
      <span>pad scale</span>
    </DetailSurface>,
  );
  await expect.element(scale.getByText("pad scale")).toBeVisible();
  expect(css(surfaceOf(scale, "pad scale"), "padding")).toBe("16px");

  const numeric = await renderWithAppTheme(
    <DetailSurface p={12}>
      <span>pad number</span>
    </DetailSurface>,
  );
  await expect.element(numeric.getByText("pad number")).toBeVisible();
  expect(css(surfaceOf(numeric, "pad number"), "padding")).toBe("12px");
});

test("accepts a top margin as a scale name and as a number", async () => {
  const scale = await renderWithAppTheme(
    <DetailSurface mt="md">
      <span>top scale</span>
    </DetailSurface>,
  );
  await expect.element(scale.getByText("top scale")).toBeVisible();
  expect(css(surfaceOf(scale, "top scale"), "margin-top")).toBe("12px");

  const numeric = await renderWithAppTheme(
    <DetailSurface mt={12}>
      <span>top number</span>
    </DetailSurface>,
  );
  await expect.element(numeric.getByText("top number")).toBeVisible();
  expect(css(surfaceOf(numeric, "top number"), "margin-top")).toBe("12px");
});

test("accepts a bottom margin and a minimum height", async () => {
  const screen = await renderWithAppTheme(
    <DetailSurface mb="sm" minHeight="320px">
      <span>bottom child</span>
    </DetailSurface>,
  );
  await expect.element(screen.getByText("bottom child")).toBeVisible();
  const surface = surfaceOf(screen, "bottom child");
  expect(css(surface, "margin-bottom")).toBe("8px");
  expect(css(surface, "min-height")).toBe("320px");

  const numeric = await renderWithAppTheme(
    <DetailSurface mb={20} minHeight={300}>
      <span>bottom number</span>
    </DetailSurface>,
  );
  await expect.element(numeric.getByText("bottom number")).toBeVisible();
  const other = surfaceOf(numeric, "bottom number");
  expect(css(other, "margin-bottom")).toBe("20px");
  expect(css(other, "min-height")).toBe("300px");
});

test("leaves every metric untouched when no spacing prop is passed", async () => {
  const screen = await renderWithAppTheme(
    <DetailSurface>
      <span>untouched child</span>
    </DetailSurface>,
  );
  await expect.element(screen.getByText("untouched child")).toBeVisible();
  const surface = surfaceOf(screen, "untouched child");
  expect(css(surface, "row-gap")).toBe("normal");
  expect(css(surface, "column-gap")).toBe("normal");
  expect(css(surface, "padding")).toBe("8px 16px 0px");
  expect(css(surface, "margin-top")).toBe("10px");
  expect(css(surface, "margin-bottom")).toBe("0px");
  expect(css(surface, "min-height")).toBe("0px");
});
