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
