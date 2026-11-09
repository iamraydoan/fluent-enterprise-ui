import { expect, test } from "vitest";
import { SidebarSectionLabel } from "@/components/common";
import { css, renderWithAppTheme } from "@/test-utils";

test("renders the small uppercase section label", async () => {
  const screen = await renderWithAppTheme(<SidebarSectionLabel>Folders</SidebarSectionLabel>);
  const label = screen.getByText("Folders").element() as HTMLElement;
  expect(css(label, "font-size")).toBe("11px");
  expect(css(label, "font-weight")).toBe("400");
  expect(css(label, "color")).toBe("rgb(97, 97, 97)");
  expect(css(label, "text-transform")).toBe("uppercase");
  expect(css(label, "letter-spacing")).toBe("0.5px");
  expect(css(label, "padding")).toBe("12px 12px 4px");
});
