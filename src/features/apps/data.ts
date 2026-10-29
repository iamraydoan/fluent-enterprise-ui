import type { TranslationKey } from "@/i18n";

export interface AppRow {
  name: string;
  descriptionKey: TranslationKey;
  type: string;
  state: string;
}

export const APP_ROWS: AppRow[] = [
  {
    name: "Shop Floor",
    descriptionKey: "apps.descriptions.shopFloor",
    type: "System",
    state: "Active",
  },
  {
    name: "Quality",
    descriptionKey: "apps.descriptions.quality",
    type: "System",
    state: "Active",
  },
  {
    name: "Maintenance",
    descriptionKey: "apps.descriptions.maintenance",
    type: "User defined",
    state: "Active",
  },
  {
    name: "Traceability",
    descriptionKey: "apps.descriptions.traceability",
    type: "System",
    state: "Active",
  },
];
