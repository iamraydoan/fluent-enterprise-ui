import { expect, test } from "vitest";
import { SidePanel } from "@/components/common";
import { css, renderWithAppTheme } from "@/test-utils";

test("keeps the default panel width", async () => {
  const screen = await renderWithAppTheme(
    <SidePanel title="Tree" collapsible={false}>
      <span>default panel child</span>
    </SidePanel>,
  );
  const aside = screen.getByText("default panel child").element().closest("aside") as HTMLElement;
  expect(aside.style.width).toBe("");
  expect(css(aside, "width")).toBe("300px");
});

test("honors an explicit panel width", async () => {
  const screen = await renderWithAppTheme(
    <SidePanel title="Tree" collapsible={false} width={290}>
      <span>sized panel child</span>
    </SidePanel>,
  );
  const aside = screen.getByText("sized panel child").element().closest("aside") as HTMLElement;
  expect(aside.style.width).toBe("290px");
  expect(css(aside, "width")).toBe("290px");
});
