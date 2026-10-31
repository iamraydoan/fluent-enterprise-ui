import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Input, Text, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const useDialogStyles = makeStyles({
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "140px 1fr",
    alignItems: "center",
    columnGap: "12px",
    marginBottom: "12px",
  },
  required: { color: tokens.colorPaletteRedForeground1 },
});

interface EntryDialogProps {
  initial?: {
    title: string;
    category: string;
    severity: string;
    resource: string;
    description: string;
  };
  onClose: () => void;
}

export function ShiftLogbookEntryDialog({ initial, onClose }: EntryDialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const isEdit = initial !== undefined;
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [severity, setSeverity] = useState(initial?.severity ?? "");
  const [resource, setResource] = useState(initial?.resource ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [comments, setComments] = useState("");

  const titleKey = isEdit
    ? "businessData.shiftLogbook.editEntry.title"
    : "businessData.shiftLogbook.addEntry.title";

  return (
    <BaseDialog
      open
      title={t(titleKey)}
      onClose={onClose}
      width="min(800px, 100%)"
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onClose}
          confirmLabel={t(
            isEdit
              ? "businessData.shiftLogbook.editEntry.update"
              : "businessData.shiftLogbook.addEntry.add",
          )}
        />
      }
    >
          <div className={styles.fieldRow}>
            <Text>
              <span className={styles.required}>* </span>
              {t("businessData.shiftLogbook.addEntry.titleLabel")}
            </Text>
            <Input value={title} onChange={(_, d) => setTitle(d.value)} />
          </div>
          <div className={styles.fieldRow}>
            <Text>
              <span className={styles.required}>* </span>
              {t("businessData.shiftLogbook.addEntry.category")}
            </Text>
            <Input value={category} onChange={(_, d) => setCategory(d.value)} />
          </div>
          <div className={styles.fieldRow}>
            <Text>
              <span className={styles.required}>* </span>
              {t("businessData.shiftLogbook.addEntry.severity")}
            </Text>
            <Input value={severity} onChange={(_, d) => setSeverity(d.value)} />
          </div>
          <div className={styles.fieldRow}>
            <Text>{t("businessData.shiftLogbook.addEntry.resource")}</Text>
            <Input value={resource} onChange={(_, d) => setResource(d.value)} />
          </div>
          <div className={styles.fieldRow} style={{ alignItems: "start" }}>
            <Text>{t("businessData.shiftLogbook.addEntry.description")}</Text>
            <Textarea value={description} onChange={(_, d) => setDescription(d.value)} rows={5} />
          </div>
          <div className={styles.fieldRow} style={{ alignItems: "start" }}>
            <Text>{t("businessData.shiftLogbook.addEntry.comments")}</Text>
            <Textarea value={comments} onChange={(_, d) => setComments(d.value)} rows={2} />
          </div>
    </BaseDialog>
  );
}
