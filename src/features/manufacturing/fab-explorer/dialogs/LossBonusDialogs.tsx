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

export function RecordLossBonusDialog({ open, materials, onClose, onConfirm }: OpDialogProps) {
  const { t } = useAppTranslation();
  const [type, setType] = useState("Loss");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const material = materials[0] ?? "";
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.recordLossBonus.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.recordLossBonus")}
          disabled={qty.trim() === "" || reason.trim() === ""}
        />
      }
    >
      <FormField label={t("manufacturing.fabExplorer.dialogs.recordLossBonus.material")}>
        <Input value={material} disabled />
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.recordLossBonus.type")}>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{
            padding: "6px 8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
          }}
        >
          <option value="Loss">
            {t("manufacturing.fabExplorer.dialogs.recordLossBonus.loss")}
          </option>
          <option value="Bonus">
            {t("manufacturing.fabExplorer.dialogs.recordLossBonus.bonus")}
          </option>
        </select>
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.recordLossBonus.qty")}>
        <Input value={qty} onChange={(_, d) => setQty(d.value)} />
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.recordLossBonus.reason")}>
        <Input value={reason} onChange={(_, d) => setReason(d.value)} />
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.recordLossBonus.comment")}>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </FormField>
    </BaseDialog>
  );
}

export function RecordAssembledLossBonusDialog({
  open,
  materials,
  onClose,
  onConfirm,
}: OpDialogProps) {
  const { t } = useAppTranslation();
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");
  const material = materials[0] ?? "";
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.recordAssembledLossBonus.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.recordAssembledLossBonus")}
          disabled={qty.trim() === "" || reason.trim() === ""}
        />
      }
    >
      <FormField label={t("manufacturing.fabExplorer.dialogs.recordAssembledLossBonus.material")}>
        <Input value={material} disabled />
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.recordAssembledLossBonus.qty")}>
        <Input value={qty} onChange={(_, d) => setQty(d.value)} />
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.recordAssembledLossBonus.reason")}>
        <Input value={reason} onChange={(_, d) => setReason(d.value)} />
      </FormField>
    </BaseDialog>
  );
}

export function RecordSubMaterialLossesDialog({
  open,
  materials,
  onClose,
  onConfirm,
}: OpDialogProps) {
  const { t } = useAppTranslation();
  const [subMaterial, setSubMaterial] = useState("");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");
  const material = materials[0] ?? "";
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.recordSubMaterialLosses.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.recordSubMaterialLosses")}
          disabled={subMaterial.trim() === "" || qty.trim() === ""}
        />
      }
    >
      <FormField label={t("manufacturing.fabExplorer.dialogs.recordSubMaterialLosses.material")}>
        <Input value={material} disabled />
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.recordSubMaterialLosses.subMaterial")}>
        <Input value={subMaterial} onChange={(_, d) => setSubMaterial(d.value)} />
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.recordSubMaterialLosses.qty")}>
        <Input value={qty} onChange={(_, d) => setQty(d.value)} />
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.recordSubMaterialLosses.reason")}>
        <Input value={reason} onChange={(_, d) => setReason(d.value)} />
      </FormField>
    </BaseDialog>
  );
}
