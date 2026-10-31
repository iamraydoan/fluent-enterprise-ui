import type { ReactNode } from "react";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { DataListPage } from "@/components/common/data-table/DataListPage";
import type { DataListPageProps } from "@/components/common/data-table/DataListPage";
import type { DataColumn } from "@/components/common/data-table/columns";
import { FluentProvider } from "@/components/ui";
import { initI18n } from "@/i18n";
import type { ListQueryParams } from "@/lib/listQuery";

function renderPage(ui: ReactNode) {
  localStorage.setItem("fluent-enterprise-ui:language", "en");
  initI18n();
  return render(<FluentProvider>{ui}</FluentProvider>);
}

interface Row {
  id: string;
  name: string;
}

const ROWS: Row[] = [
  { id: "1", name: "Alpha" },
  { id: "2", name: "Beta" },
];

const COLUMNS: DataColumn<Row>[] = [{ field: "name", headerName: "common.search" }];

function useListQuery(_params: ListQueryParams) {
  return {
    data: { data: ROWS, meta: { total: ROWS.length } },
    isLoading: false,
  };
}

function pageProps(overrides: Partial<DataListPageProps<Row>> = {}): DataListPageProps<Row> {
  return {
    icon: <span aria-hidden="true" />,
    titleKey: "common.search",
    listTitleKey: "manufacturing.fabLives.listTitle",
    actions: [],
    columns: COLUMNS,
    useListQuery,
    getRowId: (row: Row) => row.id,
    ...overrides,
  };
}

test("renders the list title with count and all rows", async () => {
  const screen = await renderPage(<DataListPage {...pageProps()} />);
  await expect.element(screen.getByText("FabLives (2)")).toBeVisible();
  await expect.element(screen.getByText("Alpha")).toBeVisible();
  await expect.element(screen.getByText("Beta")).toBeVisible();
});

test("clicking a row reports the row", async () => {
  const onRowClick = vi.fn();
  const screen = await renderPage(<DataListPage {...pageProps({ onRowClick })} />);
  await screen.getByText("Beta").click();
  expect(onRowClick).toHaveBeenCalledWith({ id: "2", name: "Beta" });
});

test("renders the sidebar slot when provided", async () => {
  const screen = await renderPage(
    <DataListPage {...pageProps({ sidebar: <span>side panel</span> })} />,
  );
  await expect.element(screen.getByText("side panel")).toBeVisible();
  await expect.element(screen.getByText("Alpha")).toBeVisible();
});
