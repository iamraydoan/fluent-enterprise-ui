import { expect, test } from "vitest";
import { DetailEmpty } from "@/components/common";
import { css, renderWithAppTheme } from "@/test-utils";

test("renders a centred, tertiary empty block", async () => {
  const screen = await renderWithAppTheme(<DetailEmpty>nothing here</DetailEmpty>);
  await expect.element(screen.getByText("nothing here")).toBeVisible();
  const block = screen.getByText("nothing here").element() as HTMLElement;
  expect(css(block, "padding")).toBe("32px");
  expect(css(block, "text-align")).toBe("center");
  expect(css(block, "color")).toBe("rgb(97, 97, 97)");
});
