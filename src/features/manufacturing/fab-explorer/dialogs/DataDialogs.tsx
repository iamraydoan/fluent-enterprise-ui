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

export function PostDataDialog({ open, onClose, onConfirm }: OpDialogProps) {
  const { t } = useAppTranslation();
  const [parameter, setParameter] = useState("");
  const [value, setValue] = useState("");
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.postData.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.postData")}
          disabled={parameter.trim() === "" || value.trim() === ""}
        />
      }
    >
      <FormField label={t("manufacturing.fabExplorer.dialogs.postData.parameter")}>
        <Input value={parameter} onChange={(_, d) => setParameter(d.value)} />
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.postData.value")}>
        <Input value={value} onChange={(_, d) => setValue(d.value)} />
      </FormField>
    </BaseDialog>
  );
}

export function PerformChecklistDialog({ open, onClose, onConfirm }: OpDialogProps) {
  const { t } = useAppTranslation();
  const [checklist, setChecklist] = useState("");
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.performChecklist.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.performChecklist")}
          disabled={checklist.trim() === ""}
        />
      }
    >
      <FormField label={t("manufacturing.fabExplorer.dialogs.performChecklist.checklist")}>
        <Input value={checklist} onChange={(_, d) => setChecklist(d.value)} />
      </FormField>
    </BaseDialog>
  );
}
