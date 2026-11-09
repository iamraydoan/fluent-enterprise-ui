import { expect, test } from "vitest";
import { IconContainer } from "@/components/common";
import { Add20Regular } from "@/components/icons";
import { theme } from "@/styles/theme";
import { css, renderWithAppTheme } from "@/test-utils";

test("sizes the icon and tints it from the theme", async () => {
  const reference = document.createElement("div");
  reference.style.color = theme.color.textBrand;
  document.body.append(reference);
  const expectedTone = getComputedStyle(reference).color;
  reference.remove();

  const screen = await renderWithAppTheme(
    <div data-testid="sized">
      <IconContainer icon={<Add20Regular />} size={64} tone="brand" />
    </div>,
  );
  await expect.element(screen.getByTestId("sized")).toBeVisible();
  const container = document.querySelector('[data-testid="sized"] > span') as HTMLElement;
  expect(container.style.fontSize).toBe("64px");
  expect(css(container, "font-size")).toBe("64px");
  expect(css(container, "color")).toBe(expectedTone);
  expect(css(container, "display")).toBe("inline-flex");
  expect(css(container, "align-items")).toBe("center");
  expect(css(container, "flex-shrink")).toBe("0");
});

test("accepts a string length and leaves size and tone absent by default", async () => {
  const reference = document.createElement("div");
  reference.style.color = theme.color.textBrand;
  document.body.append(reference);
  const brandTone = getComputedStyle(reference).color;
  reference.remove();

  const text = await renderWithAppTheme(
    <div data-testid="string">
      <IconContainer icon={<Add20Regular />} size="2rem" />
    </div>,
  );
  await expect.element(text.getByTestId("string")).toBeVisible();
  const sized = document.querySelector('[data-testid="string"] > span') as HTMLElement;
  expect(sized.style.fontSize).toBe("2rem");

  const plain = await renderWithAppTheme(
    <div data-testid="plain">
      <IconContainer icon={<Add20Regular />} />
    </div>,
  );
  await expect.element(plain.getByTestId("plain")).toBeVisible();
  const container = document.querySelector('[data-testid="plain"] > span') as HTMLElement;
  expect(container.style.fontSize).toBe("");
  expect(css(container, "font-size")).not.toBe("64px");
  expect(css(container, "color")).not.toBe(brandTone);
  expect(css(container, "display")).toBe("inline-flex");
});
