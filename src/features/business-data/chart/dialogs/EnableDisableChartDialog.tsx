import { useState } from "react";
import { Button, Textarea } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { DialogShell } from "./dialogShared";
import { useDialogStyles } from "./dialogStyles";

export function EnableDisableChartDialog({
  open,
  chartName,
  enabling,
  onClose,
  onConfirm,
}: {
  open: boolean;
  chartName: string;
  enabling: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [comment, setComment] = useState("");
  return (
    <DialogShell
      open={open}
      title={t(
        enabling
          ? "businessData.chart.operations.enableTitle"
          : "businessData.chart.operations.disableTitle",
      )}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={() => onConfirm(comment)}>
            {t(
              enabling
                ? "businessData.chart.operations.enable"
                : "businessData.chart.operations.disable",
            )}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t(
          enabling
            ? "businessData.chart.operations.enableMessage"
            : "businessData.chart.operations.disableMessage",
          {
            name: chartName,
          },
        )}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </DialogShell>
  );
}
