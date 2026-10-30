import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef, RowData } from "@tanstack/react-table";
import type { DataTableMeta } from "@/components/common/data-table/ColumnChooser";
import type { DataColumn } from "@/components/common/data-table/columns";
import { defaultCellText, getColumnValue } from "@/components/common/data-table/columns";
import type { DataTableFeatures } from "@/components/common/data-table/tableFeatures";
import { TableCellLayout, Text, tokens } from "@/components/ui";
import type { TranslationKey } from "@/i18n";

export type TranslateFn = (key: TranslationKey) => string;

export function toColumnDefs<TRow extends RowData>(
  columns: DataColumn<TRow>[],
  t: TranslateFn,
): ColumnDef<DataTableFeatures, TRow>[] {
  const helper = createColumnHelper<DataTableFeatures, TRow>();
  return helper.columns(
    columns.map((column) =>
      helper.accessor((row) => getColumnValue(column, row), {
        id: column.field,
        header: () => t(column.headerName),
        cell: (info) => {
          const value = info.getValue();
          if (column.enumOptions) {
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
          const custom = column.cellRenderer?.(info.row.original);
          const content = custom === undefined ? defaultCellText(info.getValue()) : custom;
          if (!column.truncate) return content;
          const raw = info.getValue();
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
      }),
    ),
  );
}
