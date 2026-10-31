import type { TranslationKey } from "@/i18n";
import { EntityTerminateDialog } from "../../components/EntityTerminateDialog";
import type { TerminateMode } from "../../components/wizardMode";

const L: Record<string, TranslationKey> = {
  terminateTitle: "businessData.maintenancePlan.terminateDialog.title",
  terminateMessage: "businessData.maintenancePlan.terminateDialog.message",
  terminateConfirm: "businessData.maintenancePlan.terminateDialog.terminate",
  unterminateTitle: "businessData.maintenancePlan.terminateDialog.unterminateTitle",
  unterminateMessage: "businessData.maintenancePlan.terminateDialog.unterminateMessage",
  unterminateConfirm: "businessData.maintenancePlan.terminateDialog.unterminate",
};

export function MaintenancePlanTerminateDialog({
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
