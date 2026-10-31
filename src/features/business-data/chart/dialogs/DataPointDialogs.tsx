import { useState } from "react";
import type { ChartDataPoint } from "@/api";
import { Button, Input, Textarea } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { DialogShell } from "./dialogShared";
import { useDialogStyles } from "./dialogStyles";

export function AnnotateDataPointDialog({
  open,
  dataPoint,
  onClose,
  onConfirm,
}: {
  open: boolean;
  dataPoint: ChartDataPoint | null;
  onClose: () => void;
  onConfirm: (input: { annotation: string; annotationCode: string; comment: string }) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [code, setCode] = useState("");
  const [annotation, setAnnotation] = useState("");
  const [comment, setComment] = useState("");
  if (!open || !dataPoint) return null;
  return (
    <DialogShell
      open={open}
      title={t("businessData.chart.operations.annotateTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            disabled={annotation.trim() === ""}
            onClick={() => onConfirm({ annotation, annotationCode: code, comment })}
          >
            {t("businessData.chart.operations.annotate")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.chart.operations.annotateHint", { id: dataPoint.sampleId })}
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.chart.operations.annotationCode")}
        </span>
        <Input value={code} onChange={(_, d) => setCode(d.value)} />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.annotation")} *</span>
        <Textarea value={annotation} onChange={(_, d) => setAnnotation(d.value)} />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </DialogShell>
  );
}

export function EditDataPointDialog({
  open,
  dataPoint,
  onClose,
  onConfirm,
}: {
  open: boolean;
  dataPoint: ChartDataPoint | null;
  onClose: () => void;
  onConfirm: (input: { readings: number[]; comment: string }) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [readings, setReadings] = useState<string[]>(dataPoint?.readings.map(String) ?? []);
  const [comment, setComment] = useState("");
  if (!open || !dataPoint) return null;
  const setAt = (i: number, raw: string) => {
    const next = [...readings];
    next[i] = raw;
    setReadings(next);
  };
  return (
    <DialogShell
      open={open}
      title={t("businessData.chart.operations.editDataPointTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
            onClick={() =>
              onConfirm({
                readings: readings.map((r) => Number(r)).filter((n) => !Number.isNaN(n)),
                comment,
              })
            }
          >
            {t("common.save")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.chart.operations.editDataPointHint", { id: dataPoint.sampleId })}
      </div>
      {readings.map((r, i) => (
        <div key={i} className={styles.readingRow}>
          <span style={{ minWidth: "110px", fontSize: "13px" }}>
            {t("businessData.chart.operations.reading", { index: i + 1 })}
          </span>
          <Input type="number" value={r} onChange={(_, d) => setAt(i, d.value)} />
        </div>
      ))}
      <div className={styles.fieldRow} style={{ marginTop: "12px" }}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </DialogShell>
  );
}

export function DataPointConfirmDialog({
  open,
  titleKey,
  message,
  confirmLabel,
  onClose,
  onConfirm,
}: {
  open: boolean;
  titleKey:
    | "businessData.chart.operations.excludeTitle"
    | "businessData.chart.operations.includeTitle"
    | "businessData.chart.operations.removeDataPointTitle";
  message: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: (comment: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [comment, setComment] = useState("");
  return (
    <DialogShell
      open={open}
      title={t(titleKey)}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={() => onConfirm(comment)}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>{message}</div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.chart.operations.comment")}</span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </DialogShell>
  );
}
