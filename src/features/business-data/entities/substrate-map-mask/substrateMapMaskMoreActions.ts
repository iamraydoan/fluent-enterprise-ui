import type { TranslationKey } from "@/i18n";

export interface DetailMoreAction {
  id: string;
  labelKey: TranslationKey;
}

export const substrateMapMaskMoreActions: DetailMoreAction[] = [
  { id: "clone", labelKey: "businessData.substrateMapMask.clone.menuLabel" },
  { id: "terminate", labelKey: "businessData.substrateMapMask.terminate.menuLabel" },
  { id: "unterminate", labelKey: "businessData.substrateMapMask.unterminate.menuLabel" },
  { id: "apply", labelKey: "businessData.substrateMapMask.apply.menuLabel" },
  { id: "changeInfo", labelKey: "businessData.substrateMapMask.changeInfo.menuLabel" },
];
