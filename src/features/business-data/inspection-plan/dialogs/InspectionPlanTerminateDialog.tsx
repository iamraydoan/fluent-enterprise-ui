import type { TranslationKey } from "@/i18n";
import { EntityTerminateDialog } from "../../components/EntityTerminateDialog";
import type { TerminateMode } from "../../components/wizardMode";

const L: Record<string, TranslationKey> = {
  terminateTitle: "businessData.inspectionPlan.terminateDialog.title",
  terminateMessage: "businessData.inspectionPlan.terminateDialog.message",
  terminateConfirm: "businessData.inspectionPlan.terminateDialog.terminate",
  unterminateTitle: "businessData.inspectionPlan.terminateDialog.unterminateTitle",
  unterminateMessage: "businessData.inspectionPlan.terminateDialog.unterminateMessage",
  unterminateConfirm: "businessData.inspectionPlan.terminateDialog.unterminate",
};

export function InspectionPlanTerminateDialog({
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
