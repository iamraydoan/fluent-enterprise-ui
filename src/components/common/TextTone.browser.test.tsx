import { expect, test } from "vitest";
import { Text } from "@/components/ui";
import { renderWithAppTheme } from "@/test-utils";

test("renders tertiary tone text", async () => {
  const screen = await renderWithAppTheme(<Text tone="tertiary">tertiary text</Text>);
  await expect.element(screen.getByText("tertiary text")).toBeVisible();
  const element = document.querySelector("span") as HTMLElement;
  expect(getComputedStyle(element).color).toBe("rgb(97, 97, 97)");
});

test("renders secondary tone text", async () => {
  const screen = await renderWithAppTheme(<Text tone="secondary">secondary text</Text>);
  await expect.element(screen.getByText("secondary text")).toBeVisible();
  const element = document.querySelector("span") as HTMLElement;
  expect(getComputedStyle(element).color).toBe("rgb(66, 66, 66)");
});

test("does not tint text when no tone is given", async () => {
  const screen = await renderWithAppTheme(<Text>plain text</Text>);
  await expect.element(screen.getByText("plain text")).toBeVisible();
  const element = document.querySelector("span") as HTMLElement;
  expect(getComputedStyle(element).color).not.toBe("rgb(97, 97, 97)");
});
