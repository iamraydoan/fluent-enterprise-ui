import type { TranslationKey } from "@/i18n";
import type { TerminateMode } from "../components/wizardMode";
import { ConfirmOperationDialog } from "./ConfirmOperationDialog";

interface EntityTerminateDialogProps {
  open: boolean;
  name: string;
  mode: TerminateMode;
  terminateTitleKey: TranslationKey;
  terminateMessageKey: TranslationKey;
  terminateConfirmKey: TranslationKey;
  unterminateTitleKey?: TranslationKey;
  unterminateMessageKey?: TranslationKey;
  unterminateConfirmKey?: TranslationKey;
  onClose: () => void;
  onConfirm: () => void;
}

export function EntityTerminateDialog({
  open,
  name,
  mode,
  terminateTitleKey,
  terminateMessageKey,
  terminateConfirmKey,
  unterminateTitleKey,
  unterminateMessageKey,
  unterminateConfirmKey,
  onClose,
  onConfirm,
}: EntityTerminateDialogProps) {
  const isTerminate = mode === "terminate";
  return (
    <ConfirmOperationDialog
      open={open}
      titleKey={isTerminate ? terminateTitleKey : (unterminateTitleKey ?? terminateTitleKey)}
      messageKey={
        isTerminate ? terminateMessageKey : (unterminateMessageKey ?? terminateMessageKey)
      }
      messageParams={{ name }}
      confirmLabelKey={
        isTerminate ? terminateConfirmKey : (unterminateConfirmKey ?? terminateConfirmKey)
      }
      danger={isTerminate}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
