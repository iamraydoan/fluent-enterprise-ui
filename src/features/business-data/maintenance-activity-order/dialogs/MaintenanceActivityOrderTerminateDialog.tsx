import type { TranslationKey } from "@/i18n";
import { EntityTerminateDialog } from "../../components/EntityTerminateDialog";
import type { TerminateMode } from "../../components/wizardMode";

const L: Record<string, TranslationKey> = {
  terminateTitle: "businessData.maintenanceActivityOrder.terminateDialog.title",
  terminateMessage: "businessData.maintenanceActivityOrder.terminateDialog.message",
  terminateConfirm: "businessData.maintenanceActivityOrder.terminateDialog.terminate",
  unterminateTitle: "businessData.maintenanceActivityOrder.terminateDialog.unterminateTitle",
  unterminateMessage: "businessData.maintenanceActivityOrder.terminateDialog.unterminateMessage",
  unterminateConfirm: "businessData.maintenanceActivityOrder.terminateDialog.unterminate",
};

export function MaintenanceActivityOrderTerminateDialog({
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
