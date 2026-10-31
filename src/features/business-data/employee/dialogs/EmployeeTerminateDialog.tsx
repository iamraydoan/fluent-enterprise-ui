import type { TranslationKey } from "@/i18n";
import { EntityTerminateDialog } from "../../components/EntityTerminateDialog";
import type { TerminateMode } from "../../components/wizardMode";

const L: Record<string, TranslationKey> = {
  terminateTitle: "businessData.employee.terminateDialog.title",
  terminateMessage: "businessData.employee.terminateDialog.message",
  terminateConfirm: "businessData.employee.terminateDialog.terminate",
  unterminateTitle: "businessData.employee.terminateDialog.unterminateTitle",
  unterminateMessage: "businessData.employee.terminateDialog.unterminateMessage",
  unterminateConfirm: "businessData.employee.terminateDialog.unterminate",
};

export function EmployeeTerminateDialog({
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
