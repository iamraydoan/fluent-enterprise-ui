import { useState } from "react";
import { Button, Textarea } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { DialogShell } from "./dialogShared";
import { useDialogStyles } from "./dialogStyles";

export function RemoveLogicalChartDialog({
  open,
  logicalChartName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  logicalChartName: string;
  onClose: () => void;
  onConfirm: (comment: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [comment, setComment] = useState("");
  return (
    <DialogShell
      open={open}
      title={t("businessData.chart.operations.removeLogicalChartTitle")}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="primary" onClick={() => onConfirm(comment)}>
            {t("common.remove")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.chart.operations.removeLogicalChartMessage", { name: logicalChartName })}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.comment")}</span>
        <Textarea value={comment} onChange={setComment} />
      </div>
    </DialogShell>
  );
}
