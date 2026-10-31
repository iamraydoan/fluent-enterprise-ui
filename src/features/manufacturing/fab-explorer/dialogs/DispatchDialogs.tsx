import { useState } from "react";
import { BaseDialog, DialogFooter, FormField } from "@/components/common";
import { Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface OpDialogProps {
  open: boolean;
  materials: string[];
  onClose: () => void;
  onConfirm: () => void;
}

export function DispatchDialog({
  open,
  materials,
  resource,
  onClose,
  onConfirm,
}: OpDialogProps & { resource: string }) {
  const { t } = useAppTranslation();
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.dispatch.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.dispatch")}
        />
      }
    >
      <div>
        {t("manufacturing.fabExplorer.dialogs.dispatch.message", {
          count: materials.length,
          resource,
        })}
      </div>
    </BaseDialog>
  );
}

export function UndispatchDialog({ open, materials, onClose, onConfirm }: OpDialogProps) {
  const { t } = useAppTranslation();
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.undispatch.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.undispatch")}
        />
      }
    >
      <div>
        {t("manufacturing.fabExplorer.dialogs.undispatch.message", { count: materials.length })}
      </div>
    </BaseDialog>
  );
}

export function MoveNextDialog({ open, materials, onClose, onConfirm }: OpDialogProps) {
  const { t } = useAppTranslation();
  const [nextStep, setNextStep] = useState("");
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.moveNext.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.moveNext")}
          disabled={nextStep.trim() === ""}
        />
      }
    >
      <FormField label={t("manufacturing.fabExplorer.dialogs.moveNext.nextStep")}>
        <Input value={nextStep} onChange={(_, d) => setNextStep(d.value)} />
      </FormField>
      <div>
        {t("manufacturing.fabExplorer.dialogs.moveNext.message", {
          count: materials.length,
          step: nextStep || "—",
        })}
      </div>
    </BaseDialog>
  );
}
