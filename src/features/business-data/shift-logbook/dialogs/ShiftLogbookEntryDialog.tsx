import { useState } from "react";
import { BaseDialog, DialogFooter, FormField } from "@/components/common";
import { Input, Text, Textarea, makeStyles} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

const useDialogStyles = makeStyles({
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "140px 1fr",
    alignItems: "center",
    columnGap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  required: { color: theme.color.textDanger },
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
      <FormField
        label={
          <>
            <span className={styles.required}>* </span>
            {t("businessData.shiftLogbook.addEntry.titleLabel")}
          </>
        }
        labelWidth="140px"
      >
        <Input value={title} onChange={setTitle} />
      </FormField>
      <FormField
        label={
          <>
            <span className={styles.required}>* </span>
            {t("businessData.shiftLogbook.addEntry.category")}
          </>
        }
        labelWidth="140px"
      >
        <Input value={category} onChange={setCategory} />
      </FormField>
      <FormField
        label={
          <>
            <span className={styles.required}>* </span>
            {t("businessData.shiftLogbook.addEntry.severity")}
          </>
        }
        labelWidth="140px"
      >
        <Input value={severity} onChange={setSeverity} />
      </FormField>
      <FormField label={<>{t("businessData.shiftLogbook.addEntry.resource")}</>} labelWidth="140px">
        <Input value={resource} onChange={setResource} />
      </FormField>
      <div className={styles.fieldRow} style={{ alignItems: "start" }}>
        <Text>{t("businessData.shiftLogbook.addEntry.description")}</Text>
        <Textarea value={description} onChange={setDescription} rows={5} />
      </div>
      <div className={styles.fieldRow} style={{ alignItems: "start" }}>
        <Text>{t("businessData.shiftLogbook.addEntry.comments")}</Text>
        <Textarea value={comments} onChange={setComments} rows={2} />
      </div>
    </BaseDialog>
  );
}
