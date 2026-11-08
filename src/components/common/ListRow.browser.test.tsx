import { expect, test } from "vitest";
import { ListRow } from "@/components/common";
import { css, renderWithAppTheme } from "@/test-utils";

test("renders a titled row with a separated body and actions", async () => {
  const screen = await renderWithAppTheme(
    <ListRow title="Instance-01" subtitle="Running · Line 1" actions={<button>go</button>} />,
  );
  await expect.element(screen.getByText("Instance-01")).toBeVisible();
  await expect.element(screen.getByText("Running · Line 1")).toBeVisible();
  const title = screen.getByText("Instance-01").element() as HTMLElement;
  const body = title.parentElement as HTMLElement;
  const row = body.parentElement as HTMLElement;
  expect(css(row, "display")).toBe("flex");
  expect(css(row, "align-items")).toBe("center");
  expect(css(row, "column-gap")).toBe("12px");
  expect(css(row, "font-size")).toBe("13px");
  expect(css(row, "padding")).toBe("8px 0px");
  expect(css(row, "border-bottom")).toBe("1px solid rgb(224, 224, 224)");
  expect(body).toBe(row.children[0]);
  expect(css(body, "flex-grow")).toBe("1");
  expect(css(title, "font-weight")).toBe("600");
  const subtitle = body.children[1] as HTMLElement;
  expect(css(subtitle, "font-size")).toBe("12px");
  expect(css(subtitle, "color")).toBe("rgb(97, 97, 97)");
  const actions = row.children[1] as HTMLElement;
  expect(css(actions, "column-gap")).toBe("4px");
  expect(css(actions, "flex-wrap")).toBe("wrap");
});

test("omits the subtitle and actions when they are not given", async () => {
  const screen = await renderWithAppTheme(<ListRow title="Only title" />);
  await expect.element(screen.getByText("Only title")).toBeVisible();
  const title = screen.getByText("Only title").element() as HTMLElement;
  const row = title.parentElement?.parentElement as HTMLElement;
  expect(row.children).toHaveLength(1);
});
