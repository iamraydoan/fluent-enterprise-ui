import type { ReactNode } from "react";
import type { TranslationKey } from "@/i18n";

export interface EnumColumnOption {
  labelKey: TranslationKey;
  color?: "brand" | "success" | "warning" | "danger" | "neutral";
}

export interface DataColumn<TRow> {
  field: Extract<keyof TRow, string> | (string & {});
  headerName: TranslationKey;
  valueGetter?: (row: TRow) => unknown;
  cellRenderer?: (row: TRow) => ReactNode;
  enumOptions?: Readonly<Record<string, EnumColumnOption>>;
  width?: string;
  align?: "left" | "center";
  sortable?: boolean;
  locked?: boolean;
  defaultHidden?: boolean;
  truncate?: boolean;
}

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
