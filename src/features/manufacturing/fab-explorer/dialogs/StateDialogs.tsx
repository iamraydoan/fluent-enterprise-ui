import { useState } from "react";
import { BaseDialog, DialogFooter, FormField } from "@/components/common";
import { Input, Textarea } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface OpDialogProps {
  open: boolean;
  materials: string[];
  onClose: () => void;
  onConfirm: () => void;
}

const RESOURCE_STATES = [
  "Productive",
  "Standby",
  "Unscheduled Down",
  "Scheduled Down",
  "Engineering",
];

export function ChangeResourceStateDialog({
  open,
  resource,
  onClose,
  onConfirm,
}: {
  open: boolean;
  resource: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { t } = useAppTranslation();
  const [newState, setNewState] = useState(RESOURCE_STATES[0]);
  const [comment, setComment] = useState("");
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.changeResourceState.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.changeResourceState")}
        />
      }
    >
      <FormField label={t("manufacturing.fabExplorer.dialogs.changeResourceState.resource")}>
        <Input value={resource} disabled />
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.changeResourceState.newState")}>
        <select
          value={newState}
          onChange={(e) => setNewState(e.target.value)}
          style={{
            padding: "6px 8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
          }}
        >
          {RESOURCE_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.changeResourceState.comment")}>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </FormField>
    </BaseDialog>
  );
}

export function HoldMaterialDialog({ open, materials, onClose, onConfirm }: OpDialogProps) {
  const { t } = useAppTranslation();
  const [hold, setHold] = useState("");
  const [comment, setComment] = useState("");
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.holdMaterial.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.holdMaterial")}
          disabled={hold.trim() === ""}
        />
      }
    >
      <div>
        {t("manufacturing.fabExplorer.dialogs.holdMaterial.message", { count: materials.length })}
      </div>
      <FormField label={t("manufacturing.fabExplorer.dialogs.holdMaterial.hold")}>
        <Input value={hold} onChange={(_, d) => setHold(d.value)} />
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.holdMaterial.comment")}>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </FormField>
    </BaseDialog>
  );
}

export function ReleaseMaterialDialog({ open, materials, onClose, onConfirm }: OpDialogProps) {
  const { t } = useAppTranslation();
  const [comment, setComment] = useState("");
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.releaseMaterial.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.releaseMaterial")}
        />
      }
    >
      <div>
        {t("manufacturing.fabExplorer.dialogs.releaseMaterial.message", {
          count: materials.length,
        })}
      </div>
      <FormField label={t("manufacturing.fabExplorer.dialogs.releaseMaterial.comment")}>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </FormField>
    </BaseDialog>
  );
}

export function AbortDialog({ open, materials, onClose, onConfirm }: OpDialogProps) {
  const { t } = useAppTranslation();
  const [comment, setComment] = useState("");
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.abort.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.abort")}
          danger
        />
      }
    >
      <div>{t("manufacturing.fabExplorer.dialogs.abort.message", { count: materials.length })}</div>
      <FormField label={t("manufacturing.fabExplorer.dialogs.abort.comment")}>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </FormField>
    </BaseDialog>
  );
}

export function ReworkDialog({ open, materials, onClose, onConfirm }: OpDialogProps) {
  const { t } = useAppTranslation();
  const [step, setStep] = useState("");
  const [comment, setComment] = useState("");
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.rework.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.rework")}
          disabled={step.trim() === ""}
        />
      }
    >
      <div>
        {t("manufacturing.fabExplorer.dialogs.rework.message", {
          count: materials.length,
          step: step || "—",
        })}
      </div>
      <FormField label={t("manufacturing.fabExplorer.dialogs.rework.step")}>
        <Input value={step} onChange={(_, d) => setStep(d.value)} />
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.rework.comment")}>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </FormField>
    </BaseDialog>
  );
}

export function ChangeMaterialTypeDialog({ open, onClose, onConfirm }: OpDialogProps) {
  const { t } = useAppTranslation();
  const [newType, setNewType] = useState("");
  const [comment, setComment] = useState("");
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.changeMaterialType.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.changeMaterialType")}
          disabled={newType.trim() === ""}
        />
      }
    >
      <FormField label={t("manufacturing.fabExplorer.dialogs.changeMaterialType.newType")}>
        <Input value={newType} onChange={(_, d) => setNewType(d.value)} />
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.changeMaterialType.comment")}>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </FormField>
    </BaseDialog>
  );
}
