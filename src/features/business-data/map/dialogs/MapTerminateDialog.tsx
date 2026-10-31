import type { TranslationKey } from "@/i18n";
import { EntityTerminateDialog } from "../../components/EntityTerminateDialog";
import type { TerminateMode } from "../../components/wizardMode";

const L: Record<string, TranslationKey> = {
  terminateTitle: "businessData.map.terminateDialog.title",
  terminateMessage: "businessData.map.terminateDialog.message",
  terminateConfirm: "businessData.map.terminateDialog.terminate",
  unterminateTitle: "businessData.map.terminateDialog.unterminateTitle",
  unterminateMessage: "businessData.map.terminateDialog.unterminateMessage",
  unterminateConfirm: "businessData.map.terminateDialog.unterminate",
};

export function MapTerminateDialog({
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
