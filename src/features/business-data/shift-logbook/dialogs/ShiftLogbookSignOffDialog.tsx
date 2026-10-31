import { useState } from "react";
import type { ShiftLogbookEntry } from "@/api";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Body1Strong, Caption1, Text, Textarea, makeStyles, mergeClasses } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { formatEntryMeta } from "../shiftLogbookHelpers";

const useDialogStyles = makeStyles({
  entryCard: { marginBottom: "8px", padding: "12px" },
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
    <BaseDialog
      open
      title={t("businessData.shiftLogbook.signOff.title")}
      onClose={onClose}
      width="min(700px, 100%)"
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onClose}
          confirmLabel={t("businessData.shiftLogbook.signOff.signOff")}
        />
      }
    >
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
    </BaseDialog>
  );
}
