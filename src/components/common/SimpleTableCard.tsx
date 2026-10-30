import { useState } from "react";
import type { DataColumn } from "@/components/common/data-table/columns";
import { defaultCellText, getColumnValue } from "@/components/common/data-table/columns";
import { Search20Regular } from "@/components/icons";
import {
  Input,
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

interface SimpleTableCardProps<TRow> {
  title: (count: number) => string;
  ariaLabel: string;
  columns: DataColumn<TRow>[];
  useListQuery: (params: ListQueryParams) => ListQueryResult<TRow>;
  getRowId: (row: TRow) => string;
}

export function SimpleTableCard<TRow>({
  title,
  ariaLabel,
  columns,
  useListQuery,
  getRowId,
}: SimpleTableCardProps<TRow>) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const { data, isLoading } = useListQuery({
    page: 1,
    limit: 100,
    filters: debouncedSearch === "" ? {} : { q: debouncedSearch },
  });
  const rows = data?.data ?? [];
  const total = data?.meta.total ?? 0;

  return (
    <section className={sharedStyles.contentCard} aria-label={ariaLabel}>
      <div className={sharedStyles.filterBar}>
        <Input
          className={sharedStyles.searchInput}
          appearance="outline"
          contentBefore={<Search20Regular />}
          placeholder={t("common.search")}
          value={searchQuery}
          onChange={(_, d) => setSearchQuery(d.value)}
          aria-label={t("common.search")}
        />
      </div>
      <div className={sharedStyles.titleRow}>
        <Text weight="semibold" size={400}>
          {title(total)}
        </Text>
      </div>
      <div className={sharedStyles.tableScroll} style={{ flexGrow: 0 }}>
        <Table
          aria-label={ariaLabel}
          style={{ tableLayout: "fixed", width: "100%", minWidth: 640 }}
        >
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHeaderCell
                  key={column.key}
                  className={sharedStyles.tableHeaderCell}
                  style={column.width ? { width: column.width } : undefined}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: column.align === "center" ? "center" : "flex-start",
                    }}
                  >
                    {t(column.labelKey)}
                  </div>
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={getRowId(row)}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={sharedStyles.tableCell}>
                    {column.render
                      ? (column.render(row) ?? null)
                      : defaultCellText(getColumnValue(column, row))}
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
    </section>
  );
}
