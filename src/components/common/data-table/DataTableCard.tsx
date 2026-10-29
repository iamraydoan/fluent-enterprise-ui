import { useTable } from "@tanstack/react-table";
import type {
  ColumnDef,
  ColumnOrderState,
  ColumnVisibilityState,
  PaginationState,
  RowData,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import type { ReactElement } from "react";
import { StateFilter } from "@/components/common/StateFilter";
import { ColumnChooser } from "@/components/common/data-table/ColumnChooser";
import type { DataTableMeta } from "@/components/common/data-table/ColumnChooser";
import { TablePagination } from "@/components/common/data-table/TablePagination";
import {
  dataTableFeatures,
  type DataTableFeatures,
} from "@/components/common/data-table/tableFeatures";
import { MoreVertical20Regular } from "@/components/icons";
import {
  Button,
  Input,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useSharedStyles } from "@/styles/shared";

interface DataTableQueryParams {
  page: number;
  limit: number;
  sort?: string;
  q?: string;
  state?: string;
}

interface DataTableQueryResult<TRow> {
  data?: { data: TRow[]; meta: { total: number } };
  isLoading: boolean;
}

interface DataTableCardProps<TRow extends RowData> {
  title: (count: number) => string;
  ariaLabel: string;
  columns: ColumnDef<DataTableFeatures, TRow>[];
  stateOptions: string[];
  searchIcon?: ReactElement;
  useListQuery: (params: DataTableQueryParams) => DataTableQueryResult<TRow>;
  getRowId?: (row: TRow) => string;
  onRowClick?: (row: TRow) => void;
}

export function DataTableCard<TRow extends RowData>({
  title,
  ariaLabel,
  columns,
  stateOptions,
  searchIcon,
  useListQuery,
  getRowId,
  onRowClick,
}: DataTableCardProps<TRow>) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const [stateFilter, setStateFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 });
  const [emptyRows] = useState<TRow[]>([]);

  const resetPage = () => setPagination((p) => ({ ...p, pageIndex: 0 }));

  const { data, isLoading } = useListQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sort: sorting.length > 0 ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}` : undefined,
    q: debouncedSearch === "" ? undefined : debouncedSearch,
    state: stateFilter === "all" ? undefined : stateFilter,
  });
  const rows = data?.data ?? emptyRows;
  const total = data?.meta.total ?? 0;

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data: rows,
    rowCount: total,
    getRowId,
    state: { sorting, columnVisibility, columnOrder, pagination },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    manualSorting: true,
    manualPagination: true,
  });

  const resetAll = () => {
    setSearchQuery("");
    setStateFilter("all");
    table.resetSorting();
    table.resetColumnVisibility();
    table.resetColumnOrder();
    table.setPageIndex(0);
  };

  return (
    <section className={sharedStyles.contentCard} aria-label={ariaLabel}>
      <div className={sharedStyles.filterBar}>
        <StateFilter
          value={stateFilter}
          options={stateOptions}
          onChange={(value) => {
            setStateFilter(value);
            resetPage();
          }}
        />
        <Input
          className={sharedStyles.searchInput}
          appearance="outline"
          contentBefore={searchIcon}
          placeholder={t("common.search")}
          value={searchQuery}
          onChange={(_, d) => {
            setSearchQuery(d.value);
            resetPage();
          }}
          aria-label={t("common.search")}
        />
      </div>
      <div className={sharedStyles.titleRow}>
        <Text weight="semibold" size={400}>
          {title(total)}
        </Text>
        <div>
          <ColumnChooser table={table} />
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button
                appearance="subtle"
                icon={<MoreVertical20Regular />}
                aria-label={t("common.moreOptions")}
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    table.resetColumnVisibility();
                    table.resetColumnOrder();
                  }}
                >
                  {t("common.resetColumns")}
                </MenuItem>
                <MenuItem onClick={() => table.resetSorting()}>{t("common.clearSorting")}</MenuItem>
                <MenuDivider />
                <MenuItem onClick={resetAll}>{t("common.resetAll")}</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </div>
      <div className={sharedStyles.tableScroll}>
        <Table
          aria-label={ariaLabel}
          style={{ tableLayout: "fixed", width: "100%", minWidth: 640 }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as DataTableMeta | undefined;
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHeaderCell
                      key={header.id}
                      className={sharedStyles.tableHeaderCell}
                      style={meta?.width ? { width: meta.width } : undefined}
                      sortDirection={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : undefined
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: meta?.centered ? "center" : "flex-start",
                          }}
                        >
                          <button
                            className={sharedStyles.tableHeaderButton}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <table.FlexRender header={header} />
                          </button>
                        </div>
                      )}
                    </TableHeaderCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={sharedStyles.tableCell}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!isLoading && rows.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: tokens.colorNeutralForeground3 }}>
            {t("common.noRecordsFound")}
          </div>
        )}
      </div>
      <TablePagination
        pageSize={pagination.pageSize}
        onPageSizeChange={(size) => table.setPageSize(size)}
        currentPage={pagination.pageIndex + 1}
        pages={table.getPageCount()}
        total={total}
        onPageChange={(page) => table.setPageIndex(page - 1)}
      />
    </section>
  );
}
