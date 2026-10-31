import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Textarea } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import type { MaoAction } from "../wizardMode";

const L: Record<string, TranslationKey> = {
  changeStateTitle: "businessData.maintenanceActivityOrder.changeState.title",
  changeStateMessage: "businessData.maintenanceActivityOrder.changeState.message",
  comment: "businessData.maintenanceActivityOrder.changeState.comment",
  confirm: "businessData.maintenanceActivityOrder.changeState.confirm",
  cancel: "businessData.maintenanceActivityOrder.terminateDialog.cancel",
  approve: "businessData.maintenanceActivityOrder.changeState.approve",
  release: "businessData.maintenanceActivityOrder.changeState.release",
  begin: "businessData.maintenanceActivityOrder.changeState.begin",
  complete: "businessData.maintenanceActivityOrder.changeState.complete",
  accept: "businessData.maintenanceActivityOrder.changeState.accept",
  reject: "businessData.maintenanceActivityOrder.changeState.reject",
  cancelAction: "businessData.maintenanceActivityOrder.changeState.cancelAction",
  skip: "businessData.maintenanceActivityOrder.changeState.skip",
  abort: "businessData.maintenanceActivityOrder.changeState.abort",
  rework: "businessData.maintenanceActivityOrder.changeState.rework",
};

const ACTION_LABELS: Record<MaoAction, TranslationKey> = {
  approve: L.approve,
  release: L.release,
  begin: L.begin,
  complete: L.complete,
  accept: L.accept,
  reject: L.reject,
  cancelAction: L.cancelAction,
  skip: L.skip,
  abort: L.abort,
  rework: L.rework,
};

export function MaoChangeStateDialog({
  name,
  action,
  onClose,
}: {
  name: string;
  action: MaoAction;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const [comment, setComment] = useState("");
  const actionLabel = t(ACTION_LABELS[action]);

  return (
    <BaseDialog
      open
      title={t(L.changeStateTitle, { action: actionLabel })}
      size="sm"
      onClose={onClose}
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.confirm)} />}
    >
      <div>{t(L.changeStateMessage, { action: actionLabel, name })}</div>
      <Textarea
        placeholder={t(L.comment)}
        value={comment}
        onChange={(_, d) => setComment(d.value)}
      />
    </BaseDialog>
  );
}
