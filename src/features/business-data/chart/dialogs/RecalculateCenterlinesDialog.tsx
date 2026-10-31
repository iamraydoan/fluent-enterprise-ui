import { useState } from "react";
import type { ChartDataPoint } from "@/api";
import { Button, Input, Textarea } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { DialogShell } from "./dialogShared";
import { useDialogStyles } from "./dialogStyles";

export function RecalculateCenterlinesDialog({
  open,
  logicalChartName,
  defaultPoints,
  dataPoints,
  onClose,
  onRecalculate,
}: {
  open: boolean;
  logicalChartName: string;
  defaultPoints: number;
  dataPoints: ChartDataPoint[];
  onClose: () => void;
  onRecalculate: (points: number) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [points, setPoints] = useState(defaultPoints);
  const [comment, setComment] = useState("");
  const [preview, setPreview] = useState<{ centerline1: number; stdDev: number } | null>(null);
  const doPreview = () => {
    const considered = dataPoints
      .filter((d) => d.status === "Active" || d.status === "Edited")
      .slice(-points);
    const all = considered.flatMap((d) => d.readings);
    const avg = all.length > 0 ? all.reduce((a, b) => a + b, 0) / all.length : 0;
    const variance =
      all.length > 0 ? all.reduce((a, b) => a + (b - avg) * (b - avg), 0) / all.length : 0;
    setPreview({
      centerline1: Number(avg.toFixed(4)),
      stdDev: Number(Math.sqrt(variance).toFixed(4)),
    });
  };
  return (
    <DialogShell
      open={open}
      title={t("businessData.chart.operations.recalculateTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="secondary" onClick={doPreview}>
            {t("businessData.chart.operations.preview")}
          </Button>
          <Button appearance="primary" onClick={() => onRecalculate(points)}>
            {t("businessData.chart.operations.recalculateSet")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.chart.operations.recalculateHint", { name: logicalChartName })}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.chart.operations.numberOfPoints")}
        </span>
        <Input
          type="number"
          value={String(points)}
          onChange={(_, d) => setPoints(Number(d.value) || 0)}
        />
      </div>
      {preview && (
        <div className={styles.preview}>
          {t("businessData.chart.operations.previewResult", {
            centerline1: String(preview.centerline1),
            stdDev: String(preview.stdDev),
          })}
        </div>
      )}
      <div className={styles.fieldRow} style={{ marginTop: "12px" }}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </DialogShell>
  );
}
