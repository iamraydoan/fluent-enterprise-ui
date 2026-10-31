import type { TranslationKey } from "@/i18n";
import { EntityTerminateDialog } from "../../components/EntityTerminateDialog";
import type { TerminateMode } from "../../components/wizardMode";

const L: Record<string, TranslationKey> = {
  terminateTitle: "businessData.facility.terminateDialog.title",
  terminateMessage: "businessData.facility.terminateDialog.message",
  terminateConfirm: "businessData.facility.terminateDialog.terminate",
  unterminateTitle: "businessData.facility.terminateDialog.unterminateTitle",
  unterminateMessage: "businessData.facility.terminateDialog.unterminateMessage",
  unterminateConfirm: "businessData.facility.terminateDialog.unterminate",
};

export function FacilityTerminateDialog({
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
