import type { TranslationKey } from "@/i18n";

export interface DetailMoreAction {
  id: string;
  labelKey: TranslationKey;
}

export const substrateMapMoreActions: DetailMoreAction[] = [
  { id: "clone", labelKey: "businessData.substrateMap.clone.menuLabel" },
  { id: "terminate", labelKey: "businessData.substrateMap.terminate.menuLabel" },
  { id: "unterminate", labelKey: "businessData.substrateMap.unterminate.menuLabel" },
  { id: "changeBinValues", labelKey: "businessData.substrateMap.changeBinValues.menuLabel" },
  { id: "createOverlay", labelKey: "businessData.substrateMap.createOverlay.menuLabel" },
  { id: "download", labelKey: "businessData.substrateMap.download.menuLabel" },
  { id: "search", labelKey: "businessData.substrateMap.search.menuLabel" },
  { id: "viewHistory", labelKey: "businessData.substrateMap.viewHistory.menuLabel" },
  { id: "viewGenealogy", labelKey: "businessData.substrateMap.viewGenealogy.menuLabel" },
];
