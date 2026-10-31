import { useState } from "react";
import { BaseDialog, DialogFooter, FormField } from "@/components/common";
import { Input, Textarea } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const TITLE_SEPARATOR = "—";

const L: Record<string, TranslationKey> = {
  editTitle: "businessData.maintenanceActivityOrder.dialog.editTitle",
  description: "businessData.maintenanceActivityOrder.dialog.description",
  dataGroup: "businessData.maintenanceActivityOrder.dialog.dataGroup",
  cancel: "businessData.maintenanceActivityOrder.dialog.cancel",
  save: "businessData.maintenanceActivityOrder.dialog.save",
};

export function MaintenanceActivityOrderDialog({
  name,
  onClose,
}: {
  name: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const [description, setDescription] = useState("");
  const [dataGroup, setDataGroup] = useState("");

  return (
    <BaseDialog
      open
      title={`${t(L.editTitle)} ${TITLE_SEPARATOR} ${name}`}
      size="md"
      onClose={onClose}
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.save)} />}
    >
      <FormField label={<>{t(L.description)}</>} labelWidth="160px">
        <Textarea value={description} onChange={(_, d) => setDescription(d.value)} />
      </FormField>
      <FormField label={<>{t(L.dataGroup)}</>} labelWidth="160px">
        <Input value={dataGroup} onChange={(_, d) => setDataGroup(d.value)} />
      </FormField>
    </BaseDialog>
  );
}
