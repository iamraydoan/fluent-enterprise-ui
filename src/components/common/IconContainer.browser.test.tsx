import { expect, test } from "vitest";
import { IconContainer } from "@/components/common";
import { Add20Regular } from "@/components/icons";
import { theme } from "@/styles/theme";
import { css, renderWithAppTheme } from "@/test-utils";

function tokenValue(token: string, property: string) {
  const root = document.querySelector(".fui-FluentProvider") as HTMLElement;
  const probe = document.createElement("div");
  const plain = document.createElement("div");
  root.append(probe, plain);
  probe.setAttribute("style", property + ": " + token);
  const expected = getComputedStyle(probe).getPropertyValue(property);
  const fallback = getComputedStyle(plain).getPropertyValue(property);
  probe.remove();
  plain.remove();
  expect(expected).not.toBe(fallback);
  return expected;
}

test("sizes the icon and tints it from an in-provider token", async () => {
  const screen = await renderWithAppTheme(
    <div data-testid="sized">
      <IconContainer icon={<Add20Regular />} size={64} tone="brand" />
    </div>,
  );
  await expect.element(screen.getByTestId("sized")).toBeVisible();
  const expectedTone = tokenValue(theme.color.textBrand, "color");
  const container = document.querySelector('[data-testid="sized"] > span') as HTMLElement;
  expect(container.style.fontSize).toBe("64px");
  expect(css(container, "font-size")).toBe("64px");
  expect(css(container, "color")).toBe(expectedTone);
  expect(css(container, "display")).toBe("inline-flex");
  expect(css(container, "align-items")).toBe("center");
  expect(css(container, "flex-shrink")).toBe("0");
});

test("accepts a string length and leaves size and tone absent by default", async () => {
  const text = await renderWithAppTheme(
    <div data-testid="string">
      <IconContainer icon={<Add20Regular />} size="2rem" />
    </div>,
  );
  await expect.element(text.getByTestId("string")).toBeVisible();
  const expectedTone = tokenValue(theme.color.textBrand, "color");
  const sized = document.querySelector('[data-testid="string"] > span') as HTMLElement;
  expect(sized.style.fontSize).toBe("2rem");
  expect(css(sized, "color")).not.toBe(expectedTone);

  const plain = await renderWithAppTheme(
    <div data-testid="plain">
      <IconContainer icon={<Add20Regular />} />
    </div>,
  );
  await expect.element(plain.getByTestId("plain")).toBeVisible();
  const container = document.querySelector('[data-testid="plain"] > span') as HTMLElement;
  expect(container.style.fontSize).toBe("");
  expect(css(container, "font-size")).not.toBe("64px");
  expect(css(container, "display")).toBe("inline-flex");
});
