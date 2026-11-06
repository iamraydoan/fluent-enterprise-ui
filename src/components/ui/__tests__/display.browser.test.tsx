import {
  Avatar as FluentAvatar,
  Tab as FluentTab,
  TabList as FluentTabList,
} from "@fluentui/react-components";
import type { ReactNode } from "react";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
  Avatar,
  FluentProvider,
  Tab,
  TabList,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Tree,
  TreeItem,
  TreeItemLayout,
} from "@/components/ui";

function renderUi(ui: ReactNode) {
  return render(<FluentProvider>{ui}</FluentProvider>);
}

function classNameOf(selector: string) {
  return document.querySelector(selector)?.className;
}

test("Avatar renders the name, initials and the mapped size", async () => {
  const screen = await renderUi(
    <div>
      <div data-testid="wrapper-md">
        <Avatar name="Ada Lovelace" size="md" />
      </div>
      <div data-testid="fluent-md">
        <FluentAvatar name="Fluent Ada" size={48} />
      </div>
      <div data-testid="wrapper-number">
        <Avatar name="Grace Hopper" size={72} />
      </div>
      <div data-testid="fluent-number">
        <FluentAvatar name="Fluent Grace" size={72} />
      </div>
    </div>,
  );
  await expect.element(screen.getByRole("img", { name: "Ada Lovelace" })).toBeVisible();
  await expect.element(screen.getByText("AL")).toBeVisible();
  expect(classNameOf('[data-testid="wrapper-md"] [role="img"]')).toBe(
    classNameOf('[data-testid="fluent-md"] [role="img"]'),
  );
  expect(classNameOf('[data-testid="wrapper-number"] [role="img"]')).toBe(
    classNameOf('[data-testid="fluent-number"] [role="img"]'),
  );
});

test("Table renders header, body, rows and cells and forwards row clicks", async () => {
  const onRowClick = vi.fn();
  const screen = await renderUi(
    <Table aria-label="Records">
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell sortDirection="ascending">Status</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow onClick={onRowClick}>
          <TableCell>Mixer-01</TableCell>
          <TableCell>
            <TableCellLayout>Running</TableCellLayout>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  await expect.element(screen.getByRole("table", { name: "Records" })).toBeVisible();
  await expect.element(screen.getByRole("cell", { name: "Name" })).toBeVisible();
  await expect.element(screen.getByRole("cell", { name: "Status" })).toBeVisible();
  expect(document.querySelectorAll("th")[1]?.querySelector("svg")).not.toBeNull();
  await expect.element(screen.getByRole("cell", { name: "Mixer-01" })).toBeVisible();
  await expect.element(screen.getByRole("cell", { name: "Running" })).toBeVisible();
  await screen.getByRole("cell", { name: "Mixer-01" }).click();
  expect(onRowClick).toHaveBeenCalledTimes(1);
});

test("TabList reports the selected tab value and maps its size", async () => {
  const onTabSelect = vi.fn();
  const screen = await renderUi(
    <div>
      <div data-testid="wrapper-tabs">
        <TabList aria-label="Views" onTabSelect={onTabSelect} size="lg">
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
        </TabList>
      </div>
      <div data-testid="fluent-tabs">
        <FluentTabList size="large">
          <FluentTab value="alpha">Alpha</FluentTab>
          <FluentTab value="beta">Beta</FluentTab>
        </FluentTabList>
      </div>
    </div>,
  );
  await expect.element(screen.getByRole("tablist", { name: "Views" })).toBeVisible();
  const two = screen.getByRole("tab", { name: "Two" });
  await two.click();
  expect(onTabSelect).toHaveBeenCalledWith("two");
  await expect.element(two).toHaveAttribute("aria-selected", "true");
  expect(classNameOf('[data-testid="wrapper-tabs"] [role="tablist"]')).toBe(
    classNameOf('[data-testid="fluent-tabs"] [role="tablist"]'),
  );
});

test("Tree renders branch and leaf items and toggles a branch", async () => {
  const screen = await renderUi(
    <Tree aria-label="Files">
      <TreeItem itemType="branch" value="src">
        <TreeItemLayout>src</TreeItemLayout>
        <Tree aria-label="src folder">
          <TreeItem itemType="leaf" value="app">
            <TreeItemLayout>app.ts</TreeItemLayout>
          </TreeItem>
        </Tree>
      </TreeItem>
    </Tree>,
  );
  await expect.element(screen.getByRole("tree", { name: "Files" })).toBeVisible();
  const branch = screen.getByRole("treeitem", { name: "src" });
  const branchElement = branch.element();
  await expect.element(branch).toHaveAttribute("aria-expanded", "false");
  await branch.click();
  await vi.waitFor(() => {
    expect(branchElement.getAttribute("aria-expanded")).toBe("true");
  });
  await expect.element(screen.getByRole("treeitem", { name: "app.ts" })).toBeVisible();
});

test("Tree honours defaultOpenItems and forwards layout clicks", async () => {
  const onLayoutClick = vi.fn();
  const screen = await renderUi(
    <Tree aria-label="Open files" defaultOpenItems={["src"]}>
      <TreeItem itemType="branch" value="src">
        <TreeItemLayout>src</TreeItemLayout>
        <Tree aria-label="src folder">
          <TreeItem itemType="leaf" value="app">
            <TreeItemLayout onClick={onLayoutClick}>app.ts</TreeItemLayout>
          </TreeItem>
        </Tree>
      </TreeItem>
    </Tree>,
  );
  await expect.element(screen.getByRole("treeitem", { name: "app.ts" })).toBeVisible();
  await screen.getByText("app.ts").click();
  expect(onLayoutClick).toHaveBeenCalledTimes(1);
});

test("FluentProvider renders its children inside an ltr provider", async () => {
  const screen = await renderUi(
    <FluentProvider>
      <span>Nested content</span>
    </FluentProvider>,
  );
  await expect.element(screen.getByText("Nested content")).toBeVisible();
  const providers = Array.from(document.querySelectorAll(".fui-FluentProvider"));
  expect(providers.length).toBe(2);
  const nested = providers[providers.length - 1];
  expect(nested.getAttribute("dir")).toBe("ltr");
  expect(nested.textContent).toContain("Nested content");
});
