import type { TranslationKey } from "@/i18n";

export interface DetailMoreAction {
  id: string;
  labelKey: TranslationKey;
}

export const stepMoreActions: DetailMoreAction[] = [
  { id: "clone", labelKey: "businessData.step.clone.menuLabel" },
  { id: "terminate", labelKey: "businessData.step.terminate.menuLabel" },
  { id: "unterminate", labelKey: "businessData.step.unterminate.menuLabel" },
  { id: "manageAreas", labelKey: "businessData.step.manageAreas.menuLabel" },
  { id: "manageCosts", labelKey: "businessData.step.manageCosts.menuLabel" },
  { id: "manageFutureActions", labelKey: "businessData.step.manageFutureActions.menuLabel" },
  { id: "manageInspectionInfo", labelKey: "businessData.step.manageInspectionInfo.menuLabel" },
  { id: "manageReasons", labelKey: "businessData.step.manageReasons.menuLabel" },
  { id: "manageSamplingPlans", labelKey: "businessData.step.manageSamplingPlans.menuLabel" },
  { id: "manageScheduling", labelKey: "businessData.step.manageScheduling.menuLabel" },
  { id: "manageLogicalNames", labelKey: "businessData.step.manageLogicalNames.menuLabel" },
];
