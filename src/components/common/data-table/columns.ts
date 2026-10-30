import type { ReactNode } from "react";
import type { TranslationKey } from "@/i18n";

export interface DataColumn<TRow> {
  key: string;
  labelKey: TranslationKey;
  width?: string;
  align?: "left" | "center";
  sortable?: boolean;
  locked?: boolean;
  getValue?: (row: TRow) => unknown;
  render?: (row: TRow) => ReactNode;
}

export function getColumnValue<TRow>(column: DataColumn<TRow>, row: TRow): unknown {
  return column.getValue ? column.getValue(row) : (row as Record<string, unknown>)[column.key];
}

export function defaultCellText(value: unknown): ReactNode {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number") return value;
  return String(value);
}
