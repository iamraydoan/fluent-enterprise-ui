import type { TranslationKey } from "@/i18n";

export type EntityColumnKey =
  "name" | "description" | "system" | "relation" | "versioned" | "state";

export interface EntityColumn {
  key: EntityColumnKey;
  labelKey: TranslationKey;
  chooserLabelKey: TranslationKey;
  width: string;
  locked?: boolean;
  isCentered?: boolean;
  isBoolean?: boolean;
}

export interface VisibleColumn {
  key: EntityColumnKey;
  visible: boolean;
}

type SortDirection = "asc" | "desc";

export interface SortState {
  key: EntityColumnKey;
  dir: SortDirection;
}
