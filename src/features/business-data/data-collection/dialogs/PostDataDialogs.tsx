import { useState } from "react";
import type { DataCollectionInstance } from "@/api";
import { BaseDialog } from "@/components/common";
import { Button, Checkbox, Input, Textarea } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { type DataValueRow } from "./DataValuesEditor";
import { useDialogStyles } from "./dialogStyles";

export function PostDataDialog({
  open,
  instance,
  parameters,
  onClose,
  onConfirm,
}: {
  open: boolean;
  instance: DataCollectionInstance | null;
  parameters: { parameter: string; isOptional: boolean }[];
  onClose: () => void;
  onConfirm: (values: DataValueRow[], comment: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [rows, setRows] = useState<DataValueRow[]>([]);
  const [comment, setComment] = useState("");
  if (!instance) return null;
  const valueOf = (parameter: string) => rows.find((r) => r.parameter === parameter)?.value ?? "";
  const setValue = (parameter: string, value: string) => {
    setRows((prev) =>
      prev.some((r) => r.parameter === parameter)
        ? prev.map((r) => (r.parameter === parameter ? { ...r, value } : r))
        : [...prev, { parameter, value }],
    );
  };
  return (
    <BaseDialog
      open={open}
      size="md"
      title={t("businessData.dataCollection.operations.postDataTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={() => onConfirm(rows, comment)}>
            {t("businessData.dataCollection.operations.post")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.dataCollection.operations.postDataHint", { name: instance.name })}
      </div>
      {parameters.map((p) => (
        <div key={p.parameter} className={styles.fieldRow}>
          <span className={styles.fieldLabel}>
            {p.parameter}
            {p.isOptional ? "" : " *"}
          </span>
          <Input value={valueOf(p.parameter)} onChange={(_, d) => setValue(p.parameter, d.value)} />
        </div>
      ))}
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.dataCollection.operations.comment")}
        </span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </BaseDialog>
  );
}

export function CorrectDataDialog({
  open,
  instance,
  parameters,
  onClose,
  onConfirm,
}: {
  open: boolean;
  instance: DataCollectionInstance | null;
  parameters: { parameter: string; isOptional: boolean }[];
  onClose: () => void;
  onConfirm: (values: DataValueRow[]) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [rows, setRows] = useState<DataValueRow[]>(instance?.postedData ?? []);
  const [recalculate, setRecalculate] = useState(false);
  if (!instance) return null;
  const valueOf = (parameter: string) => rows.find((r) => r.parameter === parameter)?.value ?? "";
  const setValue = (parameter: string, value: string) => {
    setRows((prev) =>
      prev.some((r) => r.parameter === parameter)
        ? prev.map((r) => (r.parameter === parameter ? { ...r, value } : r))
        : [...prev, { parameter, value }],
    );
  };
  return (
    <BaseDialog
      open={open}
      size="md"
      title={t("businessData.dataCollection.operations.correctTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={() => onConfirm(rows)}>
            {t("businessData.dataCollection.operations.correct")}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>
        {t("businessData.dataCollection.operations.correctHint", { name: instance.name })}
      </div>
      {parameters.map((p) => (
        <div key={p.parameter} className={styles.fieldRow}>
          <span className={styles.fieldLabel}>{p.parameter}</span>
          <Input value={valueOf(p.parameter)} onChange={(_, d) => setValue(p.parameter, d.value)} />
        </div>
      ))}
      <Checkbox
        label={t("businessData.dataCollection.operations.recalculate")}
        checked={recalculate}
        onChange={() => setRecalculate(!recalculate)}
      />
    </BaseDialog>
  );
}
