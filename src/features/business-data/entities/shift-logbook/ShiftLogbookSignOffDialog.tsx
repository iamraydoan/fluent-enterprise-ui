import { useState } from "react";
import type { ShiftLogbookEntry } from "@/api";
import { Dismiss16Regular } from "@/components/icons";
import {
  Body1Strong,
  Button,
  Caption1,
  Text,
  Textarea,
  makeStyles,
  mergeClasses,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { formatEntryMeta } from "./shiftLogbookHelpers";

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
    width: "min(700px, 100%)",
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
  entryCard: { marginBottom: "8px", padding: "12px" },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    columnGap: "8px",
    padding: "12px 20px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

export function ShiftLogbookSignOffDialog({
  entries,
  onClose,
}: {
  entries: ShiftLogbookEntry[];
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const sharedStyles = useSharedStyles();
  const [comment, setComment] = useState("");

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-label={t("businessData.shiftLogbook.signOff.title")}
    >
      <div className={mergeClasses(sharedStyles.contentCard, styles.surface)}>
        <div className={styles.header}>
          <Body1Strong>{t("businessData.shiftLogbook.signOff.title")}</Body1Strong>
          <Button
            appearance="subtle"
            icon={<Dismiss16Regular />}
            onClick={onClose}
            aria-label={t("common.close")}
          />
        </div>
        <div className={styles.body}>
          <Text weight="semibold">{t("businessData.shiftLogbook.signOff.reviewEntries")}</Text>
          <div style={{ marginTop: "8px" }}>
            {entries.map((entry, i) => (
              <div key={i} className={mergeClasses(sharedStyles.contentCard, styles.entryCard)}>
                <Body1Strong>{entry.title}</Body1Strong>
                <Caption1>{formatEntryMeta(entry)}</Caption1>
                <Text>{entry.description}</Text>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "12px" }}>
            <Text>{t("businessData.shiftLogbook.signOff.comment")}</Text>
            <div style={{ marginTop: "4px" }}>
              <Textarea value={comment} onChange={(_, d) => setComment(d.value)} rows={3} />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t("businessData.shiftLogbook.cancel")}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t("businessData.shiftLogbook.signOff.signOff")}
          </Button>
        </div>
      </div>
    </div>
  );
}
