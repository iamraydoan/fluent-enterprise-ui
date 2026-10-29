import type { TranslationKey } from "@/i18n";

export type EntityState = "Active" | "Terminated";

export interface EntityType {
  id: number;
  name: string;
  description: string;
  system: boolean;
  relation: boolean;
  versioned: boolean;
  state: EntityState;
}

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
