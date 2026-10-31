import { BaseDialog, DialogFooter, FormField } from "@/components/common";
import { Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface OpDialogProps {
  open: boolean;
  materials: string[];
  onClose: () => void;
  onConfirm: () => void;
}

export function StoreDialog({
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
      title={t("manufacturing.fabExplorer.dialogs.store.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.store")}
        />
      }
    >
      <div>
        {t("manufacturing.fabExplorer.dialogs.store.message", {
          count: materials.length,
          resource,
        })}
      </div>
    </BaseDialog>
  );
}

export function RetrieveDialog({ open, materials, onClose, onConfirm }: OpDialogProps) {
  const { t } = useAppTranslation();
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.retrieve.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.retrieve")}
        />
      }
    >
      <div>
        {t("manufacturing.fabExplorer.dialogs.retrieve.message", { count: materials.length })}
      </div>
      <FormField label={t("manufacturing.fabExplorer.dialogs.retrieve.materials")}>
        <Input value={materials.join(", ")} disabled />
      </FormField>
    </BaseDialog>
  );
}
