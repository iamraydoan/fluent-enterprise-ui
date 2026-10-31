import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Add24Regular, Delete20Regular } from "@/components/icons";
import { Button, Input, Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const useDialogStyles = makeStyles({
  gridRow: {
    display: "grid",
    gridTemplateColumns: "1fr 32px",
    columnGap: "8px",
    alignItems: "center",
    marginBottom: "8px",
  },
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    alignItems: "center",
    columnGap: "12px",
    marginBottom: "12px",
    marginTop: "16px",
  },
});

export function ShiftDefinitionCloneDialog({
  sourceName,
  onClose,
}: {
  sourceName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [names, setNames] = useState<string[]>([""]);
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open
      title={t("businessData.shiftDefinition.clone.title", { name: sourceName })}
      onClose={onClose}
      width="min(640px, 100%)"
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onClose}
          confirmLabel={t("businessData.shiftDefinition.clone.clone")}
        />
      }
    >
      {names.map((name, i) => (
        <div key={i} className={styles.gridRow}>
          <Input
            value={name}
            onChange={(_, d) => setNames((prev) => prev.map((n, j) => (j === i ? d.value : n)))}
            placeholder={t("businessData.shiftDefinition.clone.namePlaceholder")}
          />
          <Button
            appearance="subtle"
            icon={<Delete20Regular />}
            onClick={() => setNames((prev) => prev.filter((_, j) => j !== i))}
            aria-label={t("actionBar.delete")}
            disabled={names.length === 1}
          />
        </div>
      ))}
      <Button
        appearance="subtle"
        icon={<Add24Regular />}
        onClick={() => setNames((prev) => [...prev, ""])}
      >
        {t("actionBar.create")}
      </Button>
      <div className={styles.fieldRow}>
        <Text>{t("businessData.shiftDefinition.clone.comment")}</Text>
        <Input value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </BaseDialog>
  );
}
