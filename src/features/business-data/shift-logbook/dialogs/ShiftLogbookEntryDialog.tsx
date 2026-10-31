import { useState } from "react";
import { Dismiss16Regular } from "@/components/icons";
import {
  Body1Strong,
  Button,
  Input,
  Text,
  Textarea,
  makeStyles,
  mergeClasses,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const useDialogStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "24px",
    boxSizing: "border-box",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  surface: {
    width: "min(800px, 100%)",
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  body: { padding: "16px 20px", overflow: "auto", minHeight: 0 },
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "140px 1fr",
    alignItems: "center",
    columnGap: "12px",
    marginBottom: "12px",
  },
  required: { color: tokens.colorPaletteRedForeground1 },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    columnGap: "8px",
    padding: "12px 20px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
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
  const sharedStyles = useSharedStyles();
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
    <div className={styles.overlay} role="dialog" aria-label={t(titleKey)}>
      <div className={mergeClasses(sharedStyles.contentCard, styles.surface)}>
        <div className={styles.header}>
          <Body1Strong>{t(titleKey)}</Body1Strong>
          <Button
            appearance="subtle"
            icon={<Dismiss16Regular />}
            onClick={onClose}
            aria-label={t("common.close")}
          />
        </div>
        <div className={styles.body}>
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
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t("businessData.shiftLogbook.cancel")}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t(
              isEdit
                ? "businessData.shiftLogbook.editEntry.update"
                : "businessData.shiftLogbook.addEntry.add",
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
