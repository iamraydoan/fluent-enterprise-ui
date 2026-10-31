import { useState } from "react";
import { BaseDialog, DialogFooter, FormField } from "@/components/common";
import { Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface TrackDialogBaseProps {
  open: boolean;
  materials: string[];
  onClose: () => void;
  onConfirm: () => void;
}

export function TrackInDialog({
  open,
  materials,
  resource,
  onClose,
  onConfirm,
}: TrackDialogBaseProps & { resource: string }) {
  const { t } = useAppTranslation();
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.trackIn.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.dialogs.trackIn.title")}
        />
      }
    >
      <div>
        {t("manufacturing.fabExplorer.dialogs.trackIn.message", {
          count: materials.length,
          resource,
        })}
      </div>
    </BaseDialog>
  );
}

export function TrackOutDialog({ open, materials, onClose, onConfirm }: TrackDialogBaseProps) {
  const { t } = useAppTranslation();
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.trackOut.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.dialogs.trackOut.title")}
        />
      }
    >
      <div>
        {t("manufacturing.fabExplorer.dialogs.trackOut.message", { count: materials.length })}
      </div>
    </BaseDialog>
  );
}

export function TrackOutAndMoveNextDialog({
  open,
  materials,
  onClose,
  onConfirm,
}: TrackDialogBaseProps) {
  const { t } = useAppTranslation();
  const [nextStep, setNextStep] = useState("");
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.trackOutAndMoveNext.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.dialogs.trackOutAndMoveNext.title")}
          disabled={nextStep.trim() === ""}
        />
      }
    >
      <FormField label={t("manufacturing.fabExplorer.dialogs.trackOutAndMoveNext.nextStep")}>
        <Input value={nextStep} onChange={(_, d) => setNextStep(d.value)} />
      </FormField>
      <div>
        {t("manufacturing.fabExplorer.dialogs.trackOutAndMoveNext.message", {
          count: materials.length,
          step: nextStep || "—",
        })}
      </div>
    </BaseDialog>
  );
}

export function DispatchAndTrackInDialog({
  open,
  materials,
  resource,
  onClose,
  onConfirm,
}: TrackDialogBaseProps & { resource: string }) {
  const { t } = useAppTranslation();
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.dispatchAndTrackIn.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.dialogs.dispatchAndTrackIn.title")}
        />
      }
    >
      <div>
        {t("manufacturing.fabExplorer.dialogs.dispatchAndTrackIn.message", {
          count: materials.length,
          resource,
        })}
      </div>
    </BaseDialog>
  );
}

export function SpecialMoveNextDialog({
  open,
  materials,
  onClose,
  onConfirm,
}: TrackDialogBaseProps) {
  const { t } = useAppTranslation();
  const [step, setStep] = useState("");
  const [flow, setFlow] = useState("");
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.specialMoveNext.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.dialogs.specialMoveNext.title")}
          disabled={step.trim() === ""}
        />
      }
    >
      <FormField label={t("manufacturing.fabExplorer.dialogs.specialMoveNext.step")}>
        <Input value={step} onChange={(_, d) => setStep(d.value)} />
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.specialMoveNext.flow")}>
        <Input value={flow} onChange={(_, d) => setFlow(d.value)} />
      </FormField>
      <div>
        {t("manufacturing.fabExplorer.dialogs.specialMoveNext.message", {
          count: materials.length,
        })}
      </div>
    </BaseDialog>
  );
}
