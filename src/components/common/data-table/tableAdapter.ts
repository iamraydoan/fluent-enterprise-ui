import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef, RowData } from "@tanstack/react-table";
import type { ReactNode } from "react";
import type { DataTableMeta } from "@/components/common/data-table/ColumnChooser";
import type { DataColumn } from "@/components/common/data-table/columns";
import type { DataTableFeatures } from "@/components/common/data-table/tableFeatures";
import type { TranslationKey } from "@/i18n";

export type TranslateFn = (key: TranslationKey) => string;

function defaultCellText(value: unknown): ReactNode {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number") return value;
  return String(value);
}

export function toColumnDefs<TRow extends RowData>(
  columns: DataColumn<TRow>[],
  t: TranslateFn,
): ColumnDef<DataTableFeatures, TRow>[] {
  const helper = createColumnHelper<DataTableFeatures, TRow>();
  return helper.columns(
    columns.map((column) =>
      helper.accessor(
        (row) =>
          column.getValue ? column.getValue(row) : (row as Record<string, unknown>)[column.key],
        {
          id: column.key,
          header: () => t(column.labelKey),
          cell: (info) => {
            const custom = column.render?.(info.row.original);
            return custom === undefined ? defaultCellText(info.getValue()) : custom;
          },
          meta: {
            labelKey: column.labelKey,
            locked: column.locked,
            width: column.width,
            centered: column.align === "center",
            sortable: column.sortable !== false,
          } satisfies DataTableMeta,
        },
      ),
    ),
  );
}
