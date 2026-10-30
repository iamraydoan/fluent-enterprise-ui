import type { TranslationKey } from "@/i18n";

export interface StateDialogConfig {
  titleKey: TranslationKey;
  messageKey: TranslationKey;
  confirmKey: TranslationKey;
}

export const TERMINATE_DIALOG_CONFIG: StateDialogConfig = {
  titleKey: "businessData.shiftDefinition.terminate.title",
  messageKey: "businessData.shiftDefinition.terminate.message",
  confirmKey: "businessData.shiftDefinition.terminate.confirm",
};

export const UNTERMINATE_DIALOG_CONFIG: StateDialogConfig = {
  titleKey: "businessData.shiftDefinition.unterminate.title",
  messageKey: "businessData.shiftDefinition.unterminate.message",
  confirmKey: "businessData.shiftDefinition.unterminate.confirm",
};
