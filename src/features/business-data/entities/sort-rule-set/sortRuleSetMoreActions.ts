import type { TranslationKey } from "@/i18n";

export interface DetailMoreAction {
  id: string;
  labelKey: TranslationKey;
}

export const sortRuleSetMoreActions: DetailMoreAction[] = [
  { id: "clone", labelKey: "businessData.sortRuleSet.clone.menuLabel" },
  { id: "terminate", labelKey: "businessData.sortRuleSet.terminate.menuLabel" },
  { id: "unterminate", labelKey: "businessData.sortRuleSet.unterminate.menuLabel" },
  { id: "manageRules", labelKey: "businessData.sortRuleSet.manageRules" },
];
