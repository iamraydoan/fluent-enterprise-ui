import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef, RowData } from "@tanstack/react-table";
import type { DataTableMeta } from "@/components/common/data-table/ColumnChooser";
import type { DataColumn } from "@/components/common/data-table/columns";
import { defaultCellText, getColumnValue } from "@/components/common/data-table/columns";
import type { DataTableFeatures } from "@/components/common/data-table/tableFeatures";
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
      }),
    ),
  );
}
