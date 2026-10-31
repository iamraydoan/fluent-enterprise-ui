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

export function SplitDialog({ open, materials, onClose, onConfirm }: OpDialogProps) {
  const { t } = useAppTranslation();
  const [newQty, setNewQty] = useState("");
  const material = materials[0] ?? "";
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.split.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.split")}
          disabled={newQty.trim() === "" || materials.length !== 1}
        />
      }
    >
      <div>{t("manufacturing.fabExplorer.dialogs.split.message", { name: material })}</div>
      <FormField label={t("manufacturing.fabExplorer.dialogs.split.material")}>
        <Input value={material} disabled />
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.split.newQty")}>
        <Input value={newQty} onChange={(_, d) => setNewQty(d.value)} />
      </FormField>
    </BaseDialog>
  );
}

export function MergeDialog({ open, materials, onClose, onConfirm }: OpDialogProps) {
  const { t } = useAppTranslation();
  const [target, setTarget] = useState(materials[0] ?? "");
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.merge.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.merge")}
          disabled={materials.length < 2}
        />
      }
    >
      <div>
        {t("manufacturing.fabExplorer.dialogs.merge.message", {
          count: materials.length,
          target: target || "—",
        })}
      </div>
      <FormField label={t("manufacturing.fabExplorer.dialogs.merge.targetMaterial")}>
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          style={{
            padding: "6px 8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
          }}
        >
          {materials.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </FormField>
    </BaseDialog>
  );
}
