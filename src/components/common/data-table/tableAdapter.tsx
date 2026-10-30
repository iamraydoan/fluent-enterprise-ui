import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef, RowData } from "@tanstack/react-table";
import type { ReactNode } from "react";
import type { DataTableMeta } from "@/components/common/data-table/ColumnChooser";
import { BooleanCell, LinkCell } from "@/components/common/data-table/cellRenderers";
import type { DataColumn } from "@/components/common/data-table/columns";
import { defaultCellText, getColumnValue } from "@/components/common/data-table/columns";
import type { DataTableFeatures } from "@/components/common/data-table/tableFeatures";
import { TableCellLayout, Text, tokens } from "@/components/ui";
import type { TranslationKey } from "@/i18n";
import { formatDateTime } from "@/lib/formatDate";

export type TranslateFn = (key: TranslationKey) => string;

export function toColumnDefs<TRow extends RowData>(
  columns: DataColumn<TRow>[],
  t: TranslateFn,
  language: string,
  onRowClick?: (row: TRow) => void,
): ColumnDef<DataTableFeatures, TRow>[] {
  const helper = createColumnHelper<DataTableFeatures, TRow>();
  const numberFormat = new Intl.NumberFormat(language);
  return helper.columns(
    columns.map((column) => {
      const currencyFormat =
        column.type === "currency"
          ? new Intl.NumberFormat(language, {
              style: "currency",
              currency: column.currencyCode ?? "USD",
            })
          : null;
      return helper.accessor((row) => getColumnValue(column, row), {
        id: column.field,
        header: () => t(column.headerName),
        cell: (info) => {
          const row = info.row.original;
          const value = info.getValue();
          if (column.type === "enum") {
            const option = column.enumOptions[String(value)];
            if (!option) {
              throw new Error(`Missing enum column option for ${column.field}: ${String(value)}`);
            }
            const color = {
              brand: tokens.colorBrandForeground1,
              success: tokens.colorPaletteGreenForeground1,
              warning: tokens.colorPaletteDarkOrangeForeground1,
              danger: tokens.colorPaletteRedForeground1,
              neutral: tokens.colorNeutralForeground2,
            }[option.color ?? "neutral"];
            return <Text style={color ? { color } : undefined}>{t(option.labelKey)}</Text>;
          }
          if (column.type === "boolean") {
            return <BooleanCell value={value} />;
          }
          let content: ReactNode;
          if (column.cellRenderer) {
            content = column.cellRenderer(row);
          } else if (column.type === "link") {
            const open = column.onCellClick ?? onRowClick;
            content = <LinkCell onOpen={() => open?.(row)}>{defaultCellText(value)}</LinkCell>;
          } else if (column.type === "dateTime") {
            content = typeof value === "number" ? formatDateTime(value) : defaultCellText(value);
          } else if (column.type === "number") {
            content =
              typeof value === "number" ? numberFormat.format(value) : defaultCellText(value);
          } else if (column.type === "currency") {
            content =
              typeof value === "number" && currencyFormat
                ? currencyFormat.format(value)
                : defaultCellText(value);
          } else {
            content = defaultCellText(value);
          }
          if (!column.truncate) return content;
          const raw = value;
          return (
            <TableCellLayout
              truncate
              title={raw === null || raw === undefined ? undefined : String(raw)}
            >
              {content}
            </TableCellLayout>
          );
        },
        meta: {
          labelKey: column.headerName,
          locked: column.locked,
          width: column.width,
          centered: column.align === "center",
          sortable: column.sortable !== false,
        } satisfies DataTableMeta,
      });
    }),
  );
}
