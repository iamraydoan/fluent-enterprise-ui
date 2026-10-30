import type { TranslationKey } from "@/i18n";

export interface DetailMoreAction {
  id: string;
  labelKey: TranslationKey;
}

export const SHIFT_DEFINITION_MORE_ACTIONS: DetailMoreAction[] = [
  { id: "clone", labelKey: "businessData.shiftDefinition.clone.menuLabel" },
  { id: "terminate", labelKey: "businessData.shiftDefinition.terminate.menuLabel" },
  { id: "unterminate", labelKey: "businessData.shiftDefinition.unterminate.menuLabel" },
];
