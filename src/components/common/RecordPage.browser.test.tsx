import { expect, test } from "vitest";
import { RecordPage } from "@/components/common";
import { css, renderWithAppTheme } from "@/test-utils";

async function renderRecordPage(suffix: string) {
  const screen = await renderWithAppTheme(
    <RecordPage
      tabs={<button type="button">Data {suffix}</button>}
      title={<span>Table {suffix}</span>}
    >
      <span>content {suffix}</span>
    </RecordPage>,
  );
  const content = screen.getByText("content " + suffix).element().parentElement as HTMLElement;
  const titleStrip = content.previousElementSibling as HTMLElement;
  const tabBar = titleStrip.previousElementSibling as HTMLElement;
  return { screen, content, titleStrip, tabBar };
}

test("renders the tab bar and title strip bands above the scrolling content", async () => {
  const { content, titleStrip, tabBar } = await renderRecordPage("one");
  expect(css(tabBar, "padding")).toBe("0px 16px");
  expect(css(tabBar, "column-gap")).toBe("4px");
  expect(css(tabBar, "border-bottom")).toBe("1px solid rgb(224, 224, 224)");
  expect(css(tabBar, "background-color")).toBe("rgb(255, 255, 255)");
  expect(css(titleStrip, "padding")).toBe("10px 16px");
  expect(css(titleStrip, "column-gap")).toBe("8px");
  expect(css(titleStrip, "border-bottom")).toBe("1px solid rgb(224, 224, 224)");
  expect(css(titleStrip, "background-color")).toBe("rgb(255, 255, 255)");
  expect(css(content, "padding")).toBe("12px");
  expect(css(content, "margin")).toBe("12px");
  expect(css(content, "background-color")).toBe("rgb(250, 250, 250)");
  expect(css(content, "border-radius")).toBe("12px");
  expect(css(content, "overflow")).toBe("auto");
  expect(css(content, "flex-grow")).toBe("1");
});

test("fills the page and spaces the bands with the shared medium gap", async () => {
  const screen = await renderWithAppTheme(
    <div style={{ height: 400, display: "flex", flexDirection: "column" }}>
      <RecordPage
        tabs={<button type="button">Definition two</button>}
        title={<span>Table two</span>}
      >
        <span>content two</span>
      </RecordPage>
    </div>,
  );
  const tabBar = screen.getByText("Definition two").element().parentElement as HTMLElement;
  const page = tabBar.parentElement as HTMLElement;
  expect(Math.round(page.getBoundingClientRect().height)).toBe(400);
  expect(css(page, "display")).toBe("flex");
  expect(css(page, "flex-direction")).toBe("column");
  expect(css(page, "row-gap")).toBe("12px");
  expect(css(page, "min-height")).toBe("0px");
});
