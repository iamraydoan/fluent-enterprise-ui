import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Input, Textarea, makeStyles } from "@/components/ui";
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

const useStyles = makeStyles({
  field: { display: "grid", gridTemplateColumns: "160px 1fr", gap: "12px", alignItems: "center" },
});

export function MaintenanceActivityOrderDialog({
  name,
  onClose,
}: {
  name: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useStyles();
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
      <div className={styles.field}>
        <label>{t(L.description)}</label>
        <Textarea value={description} onChange={(_, d) => setDescription(d.value)} />
      </div>
      <div className={styles.field}>
        <label>{t(L.dataGroup)}</label>
        <Input value={dataGroup} onChange={(_, d) => setDataGroup(d.value)} />
      </div>
    </BaseDialog>
  );
}
