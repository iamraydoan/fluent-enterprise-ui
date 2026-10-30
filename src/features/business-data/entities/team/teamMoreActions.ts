import type { TranslationKey } from "@/i18n";

export interface DetailMoreAction {
  id: string;
  labelKey: TranslationKey;
}

export const teamMoreActions: DetailMoreAction[] = [
  { id: "clone", labelKey: "businessData.team.clone.menuLabel" },
  { id: "terminate", labelKey: "businessData.team.terminate.menuLabel" },
  { id: "unterminate", labelKey: "businessData.team.unterminate.menuLabel" },
];
