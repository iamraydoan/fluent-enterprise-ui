import { useTable } from "@tanstack/react-table";
import type {
  ColumnOrderState,
  ColumnVisibilityState,
  PaginationState,
  RowData,
  SortingState,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
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
  Checkbox,
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

export interface DataTableCardApi {
  resetFilters: () => void;
  resetColumns: () => void;
}

interface DataTableCardProps<TRow extends RowData> {
  title: (count: number) => string;
  ariaLabel: string;
  columns: DataColumn<TRow>[];
  filters?: DataFilter[];
  useListQuery: (params: ListQueryParams) => ListQueryResult<TRow>;
  getRowId?: (row: TRow) => string;
  onRowClick?: (row: TRow) => void;
  apiRef?: { current: DataTableCardApi | null };
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

function defaultCheckboxValues(filters: DataFilter[]): Record<string, boolean> {
  const values: Record<string, boolean> = {};
  for (const filter of filters) {
    if (filter.type === "checkbox") {
      values[filter.param] = filter.defaultChecked ?? false;
    }
  }
  return values;
}

function initialColumnVisibility<TRow extends RowData>(
  columns: DataColumn<TRow>[],
): ColumnVisibilityState {
  const visibility: ColumnVisibilityState = {};
  for (const column of columns) {
    if (column.defaultHidden) visibility[column.field] = false;
  }
  return visibility;
}

export function DataTableCard<TRow extends RowData>({
  title,
  ariaLabel,
  columns,
  filters = [],
  useListQuery,
  getRowId,
  onRowClick,
  apiRef,
}: DataTableCardProps<TRow>) {
  const { t, language } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const [selectValues, setSelectValues] = useState<Record<string, string>>(() =>
    defaultSelectValues(filters),
  );
  const [checkboxValues, setCheckboxValues] = useState<Record<string, boolean>>(() =>
    defaultCheckboxValues(filters),
  );
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const debouncedSearch = useDebouncedValue(searchValues, 300);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(() =>
    initialColumnVisibility(columns),
  );
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 });
  const [emptyRows] = useState<TRow[]>([]);

  const resetPage = () => setPagination((p) => ({ ...p, pageIndex: 0 }));

  const queryFilters: Record<string, string> = {};
  for (const filter of filters) {
    if (filter.type === "select") {
      const value = selectValues[filter.param];
      if (value && value !== FILTER_ALL_VALUE) queryFilters[filter.param] = value;
    } else if (filter.type === "checkbox") {
      const checked = checkboxValues[filter.param] ?? false;
      if (checked !== (filter.defaultChecked ?? false)) {
        queryFilters[filter.param] = String(checked);
      }
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

  const columnDefs = useMemo(
    () => toColumnDefs(columns, t, language, onRowClick),
    [columns, t, language, onRowClick],
  );
  const table = useTable({
    features: dataTableFeatures,
    columns: columnDefs,
    data: rows,
    rowCount: total,
    getRowId,
    state: { sorting, columnVisibility, columnOrder, pagination },
    initialState: { columnVisibility: initialColumnVisibility(columns) },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    manualSorting: true,
    manualPagination: true,
  });

  const resetFilters = () => {
    setSelectValues(defaultSelectValues(filters));
    setCheckboxValues(defaultCheckboxValues(filters));
    setSearchValues({});
    table.setPageIndex(0);
  };

  const resetColumns = () => {
    table.resetColumnVisibility();
    table.resetColumnOrder();
  };

  const resetAll = () => {
    resetFilters();
    table.resetSorting();
    resetColumns();
  };

  useEffect(() => {
    if (apiRef) {
      apiRef.current = { resetFilters, resetColumns };
    }
  });

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
            ) : filter.type === "checkbox" ? (
              <Checkbox
                key={filter.param}
                checked={checkboxValues[filter.param] ?? false}
                onChange={(_, d) => {
                  setCheckboxValues((prev) => ({ ...prev, [filter.param]: !!d.checked }));
                  resetPage();
                }}
                label={t(filter.labelKey)}
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
