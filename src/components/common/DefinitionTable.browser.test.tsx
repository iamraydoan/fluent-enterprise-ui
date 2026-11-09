import { expect, test } from "vitest";
import {
  DefinitionTable,
  DefinitionTableCell,
  DefinitionTableHeaderCell,
} from "@/components/common";
import { TableBody, TableHeader, TableRow } from "@/components/ui";
import { theme } from "@/styles/theme";
import { css, renderWithAppTheme } from "@/test-utils";

function toolTable(stickyHeader: boolean, grow: boolean, minWidth: number) {
  return (
    <DefinitionTable ariaLabel="tools" minWidth={minWidth} stickyHeader={stickyHeader} grow={grow}>
      <TableHeader>
        <TableRow>
          <DefinitionTableHeaderCell width={30} />
          <DefinitionTableHeaderCell width="40%">Tool</DefinitionTableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <DefinitionTableCell>plug</DefinitionTableCell>
        </TableRow>
      </TableBody>
    </DefinitionTable>
  );
}

test("renders the cell chrome shared by both pages", async () => {
  const reference = document.createElement("div");
  reference.style.backgroundColor = theme.color.surfaceTertiary;
  document.body.append(reference);
  const expectedTone = getComputedStyle(reference).backgroundColor;
  reference.remove();

  const screen = await renderWithAppTheme(toolTable(false, false, 640));
  await expect.element(screen.getByText("Tool")).toBeVisible();
  const table = document.querySelector("table") as HTMLElement;
  const container = table.parentElement as HTMLElement;
  expect(css(container, "overflow")).toBe("auto");
  expect(css(container, "border-top-width")).toBe("1px");
  expect(css(container, "border-bottom-style")).toBe("none");
  expect(table.style.tableLayout).toBe("fixed");
  expect(table.style.width).toBe("100%");
  expect(table.style.minWidth).toBe("640px");

  const headers = Array.from(document.querySelectorAll("th")) as HTMLElement[];
  expect(headers[0].style.width).toBe("30px");
  expect(headers[1].style.width).toBe("40%");
  expect(css(headers[1], "background-color")).toBe(expectedTone);
  expect(css(headers[1], "height")).toBe("36px");
  expect(css(headers[1], "font-size")).toBe("12px");
  expect(css(headers[1], "font-weight")).toBe("400");
  expect(css(headers[1], "border-right-width")).toBe("1px");
  expect(css(headers[1], "text-transform")).toBe("uppercase");

  const cell = document.querySelector("td") as HTMLElement;
  expect(css(cell, "height")).toBe("34.5px");
  expect(css(cell, "font-size")).toBe("13px");
});

test("leaves the header non-sticky by default", async () => {
  const screen = await renderWithAppTheme(toolTable(false, false, 560));
  await expect.element(screen.getByText("Tool")).toBeVisible();
  const header = document.querySelector("th") as HTMLElement;
  expect(css(header, "position")).toBe("static");
  expect(css(header, "top")).toBe("auto");
});

test("pins the header when the sticky option is set", async () => {
  const screen = await renderWithAppTheme(toolTable(true, false, 640));
  await expect.element(screen.getByText("Tool")).toBeVisible();
  const header = document.querySelector("th") as HTMLElement;
  expect(css(header, "position")).toBe("sticky");
  expect(css(header, "top")).toBe("0px");
});

test("grows the container only when asked", async () => {
  const screen = await renderWithAppTheme(toolTable(false, true, 640));
  await expect.element(screen.getByText("Tool")).toBeVisible();
  const container = (document.querySelector("table") as HTMLElement).parentElement as HTMLElement;
  expect(css(container, "flex-grow")).toBe("1");
  expect(css(container, "min-height")).toBe("0px");
});

test("leaves the container un-grown by default", async () => {
  const screen = await renderWithAppTheme(toolTable(false, false, 560));
  await expect.element(screen.getByText("Tool")).toBeVisible();
  const container = (document.querySelector("table") as HTMLElement).parentElement as HTMLElement;
  expect(css(container, "flex-grow")).toBe("0");
  expect(container.style.minHeight).toBe("");
});
