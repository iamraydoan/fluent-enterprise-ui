import type { ReactNode } from "react";
import type { TranslationKey } from "@/i18n";

export interface EnumColumnOption {
  labelKey: TranslationKey;
  color?: "brand" | "success" | "warning" | "danger" | "neutral";
}

interface DataColumnBase<TRow> {
  field: Extract<keyof TRow, string> | (string & {});
  headerName: TranslationKey;
  onCellClick?: (row: TRow) => void;
  valueGetter?: (row: TRow) => unknown;
  cellRenderer?: (row: TRow) => ReactNode;
  width?: string;
  align?: "left" | "center";
  sortable?: boolean;
  locked?: boolean;
  defaultHidden?: boolean;
  truncate?: boolean;
  currencyCode?: string;
}

export type DataColumn<TRow> =
  | (DataColumnBase<TRow> & {
      type?: "text" | "link" | "boolean" | "dateTime" | "number" | "currency";
      enumOptions?: never;
    })
  | (DataColumnBase<TRow> & {
      type: "enum";
      enumOptions: Readonly<Record<string, EnumColumnOption>>;
    });

export function getColumnValue<TRow>(column: DataColumn<TRow>, row: TRow): unknown {
  return column.valueGetter
    ? column.valueGetter(row)
    : (row as Record<string, unknown>)[column.field];
}

export function defaultCellText(value: unknown): ReactNode {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number") return value;
  return String(value);
}
