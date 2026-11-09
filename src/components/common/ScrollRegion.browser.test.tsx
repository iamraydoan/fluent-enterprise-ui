import { expect, test } from "vitest";
import { ScrollRegion } from "@/components/common";
import { css, renderWithAppTheme } from "@/test-utils";

function regionOf(screen: Awaited<ReturnType<typeof renderWithAppTheme>>, text: string) {
  return screen.getByText(text).element().parentElement as HTMLElement;
}

test("scrolls on one axis and leaves the other alone", async () => {
  const vertical = await renderWithAppTheme(
    <ScrollRegion>
      <span>vertical child</span>
    </ScrollRegion>,
  );
  await expect.element(vertical.getByText("vertical child")).toBeVisible();
  const v = regionOf(vertical, "vertical child");
  expect(css(v, "overflow-y")).toBe("auto");
  expect(css(v, "overflow-x")).toBe("visible");

  const horizontal = await renderWithAppTheme(
    <ScrollRegion axis="horizontal">
      <span>horizontal child</span>
    </ScrollRegion>,
  );
  await expect.element(horizontal.getByText("horizontal child")).toBeVisible();
  const h = regionOf(horizontal, "horizontal child");
  expect(css(h, "overflow-x")).toBe("auto");
  expect(css(h, "overflow-y")).toBe("visible");
});

test("grows with a zero minimum and leaves both alone when absent", async () => {
  const screen = await renderWithAppTheme(
    <ScrollRegion grow>
      <span>grown region</span>
    </ScrollRegion>,
  );
  await expect.element(screen.getByText("grown region")).toBeVisible();
  const grown = regionOf(screen, "grown region");
  expect(css(grown, "flex-grow")).toBe("1");
  expect(css(grown, "min-width")).toBe("0px");
  expect(css(grown, "min-height")).toBe("0px");

  const control = await renderWithAppTheme(
    <ScrollRegion axis="horizontal">
      <span>plain region</span>
    </ScrollRegion>,
  );
  await expect.element(control.getByText("plain region")).toBeVisible();
  const plain = regionOf(control, "plain region");
  expect(css(plain, "flex-grow")).toBe("0");
  expect(plain.style.minHeight).toBe("");
  expect(plain.style.minWidth).toBe("");
});

test("applies spacing and leaves it absent by default", async () => {
  const screen = await renderWithAppTheme(
    <ScrollRegion p="lg" mt={8} mb="sm">
      <span>spaced region</span>
    </ScrollRegion>,
  );
  await expect.element(screen.getByText("spaced region")).toBeVisible();
  const spaced = regionOf(screen, "spaced region");
  expect(spaced.style.padding).toBe("var(--spacingHorizontalL)");
  expect(spaced.style.marginTop).toBe("8px");
  expect(spaced.style.marginBottom).toBe("var(--spacingHorizontalS)");

  const control = await renderWithAppTheme(
    <ScrollRegion>
      <span>unspaced region</span>
    </ScrollRegion>,
  );
  await expect.element(control.getByText("unspaced region")).toBeVisible();
  const plain = regionOf(control, "unspaced region");
  expect(plain.style.padding).toBe("");
  expect(plain.style.marginTop).toBe("");
  expect(plain.style.marginBottom).toBe("");
});
