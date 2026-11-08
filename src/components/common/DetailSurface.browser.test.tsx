import { expect, test } from "vitest";
import { DetailSurface } from "@/components/common";
import { css, renderWithAppTheme } from "@/test-utils";

test("renders the card surface with content-card metrics", async () => {
  const screen = await renderWithAppTheme(
    <DetailSurface>
      <span>surface child</span>
    </DetailSurface>,
  );
  await expect.element(screen.getByText("surface child")).toBeVisible();
  const surface = screen.getByText("surface child").element().parentElement as HTMLElement;
  expect(css(surface, "padding")).toBe("8px 16px 0px");
  expect(css(surface, "background-color")).toBe("rgb(250, 250, 250)");
  expect(css(surface, "border-radius")).toBe("12px");
  expect(css(surface, "margin-top")).toBe("10px");
  expect(css(surface, "display")).toBe("flex");
  expect(css(surface, "flex-direction")).toBe("column");
  expect(css(surface, "row-gap")).toBe("normal");
});
