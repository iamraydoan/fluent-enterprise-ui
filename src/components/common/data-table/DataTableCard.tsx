import { useTable } from "@tanstack/react-table";
import type {
  ColumnOrderState,
  ColumnVisibilityState,
  PaginationState,
  RowData,
  SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { SelectFilter } from "@/components/common/SelectFilter";
import { ColumnChooser } from "@/components/common/data-table/ColumnChooser";
import type { DataTableMeta } from "@/components/common/data-table/ColumnChooser";
import { TablePagination } from "@/components/common/data-table/TablePagination";
import type { DataColumn } from "@/components/common/data-table/columns";
import {
  FILTER_ALL_VALUE,
  allOption,
  type DataFilter,
} from "@/components/common/data-table/filters";
import { toColumnDefs } from "@/components/common/data-table/tableAdapter";
import { dataTableFeatures } from "@/components/common/data-table/tableFeatures";
import { MoreVertical20Regular, Search20Regular } from "@/components/icons";
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
import type { ListQueryParams, ListQueryResult } from "@/lib/listQuery";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useSharedStyles } from "@/styles/shared";

interface DataTableCardProps<TRow extends RowData> {
  title: (count: number) => string;
  ariaLabel: string;
  columns: DataColumn<TRow>[];
  filters?: DataFilter[];
  useListQuery: (params: ListQueryParams) => ListQueryResult<TRow>;
  getRowId?: (row: TRow) => string;
  onRowClick?: (row: TRow) => void;
}

function defaultSelectValues(filters: DataFilter[]): Record<string, string> {
  const values: Record<string, string> = {};
  for (const filter of filters) {
    if (filter.type === "select") {
      values[filter.param] = filter.includeAll
        ? FILTER_ALL_VALUE
        : (filter.options[0]?.value ?? "");
    }
  }
  return values;
}

export function DataTableCard<TRow extends RowData>({
  title,
  ariaLabel,
  columns,
  filters = [],
  useListQuery,
  getRowId,
  onRowClick,
}: DataTableCardProps<TRow>) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const [selectValues, setSelectValues] = useState<Record<string, string>>(() =>
    defaultSelectValues(filters),
  );
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const debouncedSearch = useDebouncedValue(searchValues, 300);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 });
  const [emptyRows] = useState<TRow[]>([]);

  const resetPage = () => setPagination((p) => ({ ...p, pageIndex: 0 }));

  const queryFilters: Record<string, string> = {};
  for (const filter of filters) {
    if (filter.type === "select") {
      const value = selectValues[filter.param];
      if (value && value !== FILTER_ALL_VALUE) queryFilters[filter.param] = value;
    } else {
      const value = debouncedSearch[filter.param];
      if (value) queryFilters[filter.param] = value;
    }
  }

  const { data, isLoading } = useListQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sort: sorting.length > 0 ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}` : undefined,
    filters: queryFilters,
  });
  const rows = data?.data ?? emptyRows;
  const total = data?.meta.total ?? 0;

  const columnDefs = useMemo(() => toColumnDefs(columns, t), [columns, t]);
  const table = useTable({
    features: dataTableFeatures,
    columns: columnDefs,
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
    setSelectValues(defaultSelectValues(filters));
    setSearchValues({});
    table.resetSorting();
    table.resetColumnVisibility();
    table.resetColumnOrder();
    table.setPageIndex(0);
  };

  return (
    <section className={sharedStyles.contentCard} aria-label={ariaLabel}>
      {filters.length > 0 && (
        <div className={sharedStyles.filterBar}>
          {filters.map((filter) =>
            filter.type === "select" ? (
              <SelectFilter
                key={filter.param}
                labelKey={filter.labelKey}
                value={selectValues[filter.param] ?? FILTER_ALL_VALUE}
                options={filter.includeAll ? [allOption(), ...filter.options] : filter.options}
                onChange={(value) => {
                  setSelectValues((prev) => ({ ...prev, [filter.param]: value }));
                  resetPage();
                }}
              />
            ) : (
              <Input
                key={filter.param}
                className={sharedStyles.searchInput}
                appearance="outline"
                contentBefore={<Search20Regular />}
                placeholder={filter.placeholderKey ? t(filter.placeholderKey) : t("common.search")}
                value={searchValues[filter.param] ?? ""}
                onChange={(_, d) => {
                  setSearchValues((prev) => ({ ...prev, [filter.param]: d.value }));
                  resetPage();
                }}
                aria-label={t("common.search")}
              />
            ),
          )}
        </div>
      )}
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
                  const sortable = meta?.sortable !== false;
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
                          {sortable ? (
                            <button
                              className={sharedStyles.tableHeaderButton}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <table.FlexRender header={header} />
                            </button>
                          ) : (
                            <table.FlexRender header={header} />
                          )}
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
