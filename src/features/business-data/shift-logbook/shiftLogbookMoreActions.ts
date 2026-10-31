import type { TranslationKey } from "@/i18n";

export interface DetailMoreAction {
  id: string;
  labelKey: TranslationKey;
}

export const shiftLogbookMoreActions: DetailMoreAction[] = [
  { id: "signOff", labelKey: "businessData.shiftLogbook.signOff.menuLabel" },
  { id: "summarize", labelKey: "businessData.shiftLogbook.summary.menuLabel" },
];
