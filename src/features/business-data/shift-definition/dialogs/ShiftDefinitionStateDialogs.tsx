import type { TranslationKey } from "@/i18n";
import { EntityTerminateDialog } from "../../components/EntityTerminateDialog";
import { TERMINATE, UNTERMINATE } from "../../components/wizardMode";

const L: Record<string, TranslationKey> = {
  terminateTitle: "businessData.shiftDefinition.terminate.title",
  terminateMessage: "businessData.shiftDefinition.terminate.message",
  terminateConfirm: "businessData.shiftDefinition.terminate.confirm",
  unterminateTitle: "businessData.shiftDefinition.unterminate.title",
  unterminateMessage: "businessData.shiftDefinition.unterminate.message",
  unterminateConfirm: "businessData.shiftDefinition.unterminate.confirm",
};

interface ConfirmDialogProps {
  name: string;
  onClose: () => void;
}

export function ShiftDefinitionTerminateDialog({ name, onClose }: ConfirmDialogProps) {
  return (
    <EntityTerminateDialog
      open
      name={name}
      mode={TERMINATE}
      terminateTitleKey={L.terminateTitle}
      terminateMessageKey={L.terminateMessage}
      terminateConfirmKey={L.terminateConfirm}
      onClose={onClose}
      onConfirm={onClose}
    />
  );
}

export function ShiftDefinitionUnterminateDialog({ name, onClose }: ConfirmDialogProps) {
  return (
    <EntityTerminateDialog
      open
      name={name}
      mode={UNTERMINATE}
      terminateTitleKey={L.terminateTitle}
      terminateMessageKey={L.terminateMessage}
      terminateConfirmKey={L.terminateConfirm}
      unterminateTitleKey={L.unterminateTitle}
      unterminateMessageKey={L.unterminateMessage}
      unterminateConfirmKey={L.unterminateConfirm}
      onClose={onClose}
      onConfirm={onClose}
    />
  );
}
