import type { TranslationKey } from "@/i18n";
import { EntityTerminateDialog } from "../../components/EntityTerminateDialog";
import type { TerminateMode } from "../../components/wizardMode";

const L: Record<string, TranslationKey> = {
  terminateTitle: "businessData.flow.terminateDialog.title",
  terminateMessage: "businessData.flow.terminateDialog.message",
  terminateConfirm: "businessData.flow.terminateDialog.terminate",
  unterminateTitle: "businessData.flow.terminateDialog.unterminateTitle",
  unterminateMessage: "businessData.flow.terminateDialog.unterminateMessage",
  unterminateConfirm: "businessData.flow.terminateDialog.unterminate",
};

export function FlowTerminateDialog({
  name,
  mode,
  onClose,
}: {
  name: string;
  mode: TerminateMode;
  onClose: () => void;
}) {
  return (
    <EntityTerminateDialog
      open
      name={name}
      mode={mode}
      terminateTitleKey={L.terminateTitle}
      terminateMessageKey={L.terminateMessage}
      terminateConfirmKey={L.terminateConfirm}
      unterminateTitleKey={L.terminateTitle}
      unterminateMessageKey={L.terminateMessage}
      unterminateConfirmKey={L.terminateConfirm}
      onClose={onClose}
      onConfirm={onClose}
    />
  );
}
