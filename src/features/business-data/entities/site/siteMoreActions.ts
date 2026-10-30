import type { TranslationKey } from "@/i18n";

export interface DetailMoreAction {
  id: string;
  labelKey: TranslationKey;
}

export const siteMoreActions: DetailMoreAction[] = [
  { id: "clone", labelKey: "businessData.site.clone.menuLabel" },
  { id: "terminate", labelKey: "businessData.site.terminate.menuLabel" },
  { id: "unterminate", labelKey: "businessData.site.unterminate.menuLabel" },
];
