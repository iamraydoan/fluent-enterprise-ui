import type { ReactElement } from "react";
import type { TranslationKey } from "@/i18n";

export interface BarcodeActionTile {
  id: string;
  labelKey: TranslationKey;
  icon: ReactElement;
}
