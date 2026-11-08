import { expect, test } from "vitest";
import { EntityTile } from "@/components/common";
import { theme } from "@/styles/theme";
import { renderWithAppTheme } from "@/test-utils";

test("renders without a background by default", async () => {
  const screen = await renderWithAppTheme(<EntityTile title="P1" onClick={() => undefined} />);
  await expect.element(screen.getByText("P1")).toBeVisible();
  const tile = document.querySelector('[role="button"]') as HTMLElement;
  expect(tile.style.backgroundColor).toBe("");
});

test("applies the info tone background", async () => {
  const screen = await renderWithAppTheme(
    <EntityTile title="P2" tone="info" onClick={() => undefined} />,
  );
  await expect.element(screen.getByText("P2")).toBeVisible();
  const tile = document.querySelector('[role="button"]') as HTMLElement;
  expect(tile.style.backgroundColor).toBe(theme.color.infoSubtle);
  expect(tile.style.backgroundColor).not.toBe("");
});

test("lets an explicit background win over the tone", async () => {
  const screen = await renderWithAppTheme(
    <EntityTile title="P3" tone="info" backgroundColor="#123456" onClick={() => undefined} />,
  );
  await expect.element(screen.getByText("P3")).toBeVisible();
  const tile = document.querySelector('[role="button"]') as HTMLElement;
  expect(tile.style.backgroundColor).toBe("rgb(18, 52, 86)");
});
