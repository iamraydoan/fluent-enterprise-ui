import { BaseDialog, DialogFooter } from "@/components/common";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { TERMINATE } from "../components/wizardMode";
import type { TerminateMode } from "../components/wizardMode";

const L: Record<string, TranslationKey> = {
  terminateTitle: "businessData.experimentDefinition.terminateDialog.title",
  terminateMessage: "businessData.experimentDefinition.terminateDialog.message",
  unterminateTitle: "businessData.experimentDefinition.terminateDialog.unterminateTitle",
  unterminateMessage: "businessData.experimentDefinition.terminateDialog.unterminateMessage",
  cancel: "businessData.experimentDefinition.terminateDialog.cancel",
  terminate: "businessData.experimentDefinition.terminateDialog.terminate",
  unterminate: "businessData.experimentDefinition.terminateDialog.unterminate",
  setEffectiveTitle: "businessData.experimentDefinition.terminateDialog.setEffectiveTitle",
  setEffectiveMessage: "businessData.experimentDefinition.terminateDialog.setEffectiveMessage",
  setEffective: "businessData.experimentDefinition.terminateDialog.setEffective",
};

export function ExperimentDefinitionTerminateDialog({
  name,
  mode,
  onClose,
}: {
  name: string;
  mode: TerminateMode;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const isTerminate = mode === TERMINATE;

  return (
    <BaseDialog
      open
      title={t(isTerminate ? L.terminateTitle : L.unterminateTitle)}
      size="sm"
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onClose}
          confirmLabel={t(isTerminate ? L.terminate : L.unterminate)}
          danger={isTerminate}
        />
      }
    >
      <div>{t(isTerminate ? L.terminateMessage : L.unterminateMessage, { name })}</div>
    </BaseDialog>
  );
}

export function SetEffectiveDialog({ name, onClose }: { name: string; onClose: () => void }) {
  const { t } = useAppTranslation();

  return (
    <BaseDialog
      open
      title={t(L.setEffectiveTitle)}
      size="sm"
      onClose={onClose}
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.setEffective)} />
      }
    >
      <div>{t(L.setEffectiveMessage, { name })}</div>
    </BaseDialog>
  );
}
