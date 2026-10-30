import type { TranslationKey } from "@/i18n";

export interface DetailMoreAction {
  id: string;
  labelKey: TranslationKey;
}

export const transferRequirementMoreActions: DetailMoreAction[] = [
  { id: "clone", labelKey: "businessData.transferRequirement.clone.menuLabel" },
  { id: "approve", labelKey: "businessData.transferRequirement.approve.menuLabel" },
  { id: "cancel", labelKey: "businessData.transferRequirement.cancel.menuLabel" },
  { id: "unapprove", labelKey: "businessData.transferRequirement.unapprove.menuLabel" },
  { id: "split", labelKey: "businessData.transferRequirement.split.menuLabel" },
  { id: "releaseItems", labelKey: "businessData.transferRequirement.releaseItems.menuLabel" },
  { id: "viewReport", labelKey: "businessData.transferRequirement.viewReport.menuLabel" },
];
