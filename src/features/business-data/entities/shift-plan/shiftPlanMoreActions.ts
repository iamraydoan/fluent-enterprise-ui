import type { TranslationKey } from "@/i18n";

export interface DetailMoreAction {
  id: string;
  labelKey: TranslationKey;
}

export const shiftPlanMoreActions: DetailMoreAction[] = [
  { id: "clone", labelKey: "businessData.shiftPlan.clone.menuLabel" },
  { id: "terminate", labelKey: "businessData.shiftPlan.terminate.menuLabel" },
  { id: "unterminate", labelKey: "businessData.shiftPlan.unterminate.menuLabel" },
  { id: "generateDays", labelKey: "businessData.shiftPlan.generateDays.menuLabel" },
  { id: "manageEmployees", labelKey: "businessData.shiftPlan.manageEmployees" },
  { id: "manageCalendarDays", labelKey: "businessData.shiftPlan.manageCalendarDays.menuLabel" },
];
