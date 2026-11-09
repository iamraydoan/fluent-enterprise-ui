import { expect, test } from "vitest";
import { EntityTile, TileGrid } from "@/components/common";
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

function accentOf(tile: HTMLElement) {
  return Array.from(tile.children).find(
    (child) => getComputedStyle(child as HTMLElement).position === "absolute",
  ) as HTMLElement | undefined;
}

test("resolves a numeric minimum tile width to a pixel length", async () => {
  const screen = await renderWithAppTheme(
    <TileGrid minWidth={100}>
      <span>numeric tile</span>
    </TileGrid>,
  );
  await expect.element(screen.getByText("numeric tile")).toBeVisible();
  const grid = document.querySelector('[style*="--tile-min-width"]') as HTMLElement;
  expect(grid.style.getPropertyValue("--tile-min-width")).toBe("100px");
  expect(getComputedStyle(grid).gridTemplateColumns.split(" ").length).toBeGreaterThan(1);
});

test("keeps the literal 220px default when no minimum is passed", async () => {
  const screen = await renderWithAppTheme(
    <TileGrid>
      <span>default tile</span>
    </TileGrid>,
  );
  await expect.element(screen.getByText("default tile")).toBeVisible();
  const grid = document.querySelector('[style*="--tile-min-width"]') as HTMLElement;
  expect(grid.style.getPropertyValue("--tile-min-width")).toBe("220px");
  expect(getComputedStyle(grid).gridTemplateColumns.split(" ").length).toBe(1);
});

test("passes a string minimum tile width through unchanged", async () => {
  const screen = await renderWithAppTheme(
    <TileGrid minWidth="140px">
      <span>string tile</span>
    </TileGrid>,
  );
  await expect.element(screen.getByText("string tile")).toBeVisible();
  const grid = document.querySelector('[style*="--tile-min-width"]') as HTMLElement;
  expect(grid.style.getPropertyValue("--tile-min-width")).toBe("140px");
  expect(getComputedStyle(grid).gridTemplateColumns.split(" ").length).toBeGreaterThan(1);
});

test("applies the success accent with no tint", async () => {
  const screen = await renderWithAppTheme(
    <EntityTile title="S1" tone="success" onClick={() => undefined} />,
  );
  await expect.element(screen.getByText("S1")).toBeVisible();
  const tile = document.querySelector('[role="button"]') as HTMLElement;
  expect(accentOf(tile)?.style.backgroundColor).toBe(theme.color.textSuccess);
  expect(tile.style.backgroundColor).toBe("");
});

test("applies the danger accent and the danger tint", async () => {
  const screen = await renderWithAppTheme(
    <EntityTile title="D1" tone="danger" onClick={() => undefined} />,
  );
  await expect.element(screen.getByText("D1")).toBeVisible();
  const tile = document.querySelector('[role="button"]') as HTMLElement;
  expect(accentOf(tile)?.style.backgroundColor).toBe(theme.color.textDanger);
  expect(tile.style.backgroundColor).toBe(theme.color.dangerSubtle);
});

test("keeps the info tone accent-free", async () => {
  const screen = await renderWithAppTheme(
    <EntityTile title="I1" tone="info" onClick={() => undefined} />,
  );
  await expect.element(screen.getByText("I1")).toBeVisible();
  const tile = document.querySelector('[role="button"]') as HTMLElement;
  expect(tile.style.backgroundColor).toBe(theme.color.infoSubtle);
  expect(accentOf(tile)).toBeUndefined();
});

test("leaves a toneless tile accent-free", async () => {
  const screen = await renderWithAppTheme(<EntityTile title="N1" onClick={() => undefined} />);
  await expect.element(screen.getByText("N1")).toBeVisible();
  const tile = document.querySelector('[role="button"]') as HTMLElement;
  expect(accentOf(tile)).toBeUndefined();
  expect(tile.style.backgroundColor).toBe("");
});

test("lets an explicit accent colour win over the tone accent", async () => {
  const screen = await renderWithAppTheme(
    <EntityTile title="X1" tone="danger" accentColor="#123456" onClick={() => undefined} />,
  );
  await expect.element(screen.getByText("X1")).toBeVisible();
  const tile = document.querySelector('[role="button"]') as HTMLElement;
  expect(accentOf(tile)?.style.backgroundColor).toBe("rgb(18, 52, 86)");
  expect(tile.style.backgroundColor).toBe(theme.color.dangerSubtle);
});
