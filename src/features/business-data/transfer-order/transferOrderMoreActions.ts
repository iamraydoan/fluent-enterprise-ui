import type { TranslationKey } from "@/i18n";

export interface DetailMoreAction {
  id: string;
  labelKey: TranslationKey;
}

export const transferOrderMoreActions: DetailMoreAction[] = [
  { id: "beginMovement", labelKey: "businessData.transferOrder.beginMovement.menuLabel" },
  { id: "cancel", labelKey: "businessData.transferOrder.cancel.menuLabel" },
  { id: "completeMovement", labelKey: "businessData.transferOrder.completeMovement.menuLabel" },
  { id: "confirmItems", labelKey: "businessData.transferOrder.confirmItems.menuLabel" },
  { id: "takeOwnership", labelKey: "businessData.transferOrder.takeOwnership.menuLabel" },
  { id: "viewReport", labelKey: "businessData.transferOrder.viewReport.menuLabel" },
];
