import type { TranslationKey } from "@/i18n";

export interface DetailMoreAction {
  id: string;
  labelKey: TranslationKey;
}

export const taskMoreActions: DetailMoreAction[] = [
  { id: "clone", labelKey: "businessData.task.clone.menuLabel" },
  { id: "terminate", labelKey: "businessData.task.terminate.menuLabel" },
  { id: "unterminate", labelKey: "businessData.task.unterminate.menuLabel" },
  { id: "cancel", labelKey: "businessData.task.cancel.menuLabel" },
  { id: "markCompleted", labelKey: "businessData.task.markCompleted.menuLabel" },
  { id: "perform", labelKey: "businessData.task.perform.menuLabel" },
  { id: "reassign", labelKey: "businessData.task.reassign.menuLabel" },
  { id: "sendReminder", labelKey: "businessData.task.sendReminder.menuLabel" },
];
