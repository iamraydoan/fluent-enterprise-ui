import { useState } from "react";
import type { ShiftDefinitionDetail } from "@/api";
import { BaseDialog, DialogFooter, FormField } from "@/components/common";
import { Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface ShiftDefinitionEditDialogProps {
  data: ShiftDefinitionDetail;
  onClose: () => void;
}

export function ShiftDefinitionEditDialog({ data, onClose }: ShiftDefinitionEditDialogProps) {
  const { t } = useAppTranslation();
  const [description, setDescription] = useState(data.description);
  const [calendar, setCalendar] = useState(data.calendar);

  return (
    <BaseDialog
      open
      title={t("businessData.shiftDefinition.edit.title")}
      onClose={onClose}
      width="min(640px, 100%)"
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onClose}
          confirmLabel={t("businessData.shiftDefinition.update")}
        />
      }
    >
      <FormField label={<>{t("businessData.shiftDefinition.edit.name")}</>}>
        <Input value={data.name} disabled />
      </FormField>
      <FormField label={<>{t("businessData.shiftDefinition.edit.description")}</>}>
        <Input value={description} onChange={(_, d) => setDescription(d.value)} />
      </FormField>
      <FormField label={<>{t("businessData.shiftDefinition.edit.calendar")}</>}>
        <Input value={calendar} onChange={(_, d) => setCalendar(d.value)} />
      </FormField>
    </BaseDialog>
  );
}
