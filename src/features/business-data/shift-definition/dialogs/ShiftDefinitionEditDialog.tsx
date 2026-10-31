import { useState } from "react";
import type { ShiftDefinitionDetail } from "@/api";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Input, Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const useDialogStyles = makeStyles({
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    alignItems: "center",
    columnGap: "12px",
    marginBottom: "12px",
  },
});

interface ShiftDefinitionEditDialogProps {
  data: ShiftDefinitionDetail;
  onClose: () => void;
}

export function ShiftDefinitionEditDialog({ data, onClose }: ShiftDefinitionEditDialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
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
          <div className={styles.fieldRow}>
            <Text>{t("businessData.shiftDefinition.edit.name")}</Text>
            <Input value={data.name} disabled />
          </div>
          <div className={styles.fieldRow}>
            <Text>{t("businessData.shiftDefinition.edit.description")}</Text>
            <Input value={description} onChange={(_, d) => setDescription(d.value)} />
          </div>
          <div className={styles.fieldRow}>
            <Text>{t("businessData.shiftDefinition.edit.calendar")}</Text>
            <Input value={calendar} onChange={(_, d) => setCalendar(d.value)} />
          </div>
    </BaseDialog>
  );
}
