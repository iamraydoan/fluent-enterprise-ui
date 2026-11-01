import { useState } from "react";
import { BaseDialog, DialogFooter, FormField, Grid  } from "@/components/common";
import { Add24Regular, Delete20Regular } from "@/components/icons";
import { Button, Input, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const useDialogStyles = makeStyles({
  gridRow: {
    marginBottom: "8px",
  }
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
        <Grid columns="1fr 32px" gap="8px" align="center" key={i} className={styles.gridRow}>
          <Input
            value={name}
            onChange={(value) => setNames((prev) => prev.map((n, j) => (j === i ? value : n)))}
            placeholder={t("businessData.shiftDefinition.clone.namePlaceholder")}
          />
          <Button
            variant="subtle"
            icon={<Delete20Regular />}
            onClick={() => setNames((prev) => prev.filter((_, j) => j !== i))}
            aria-label={t("actionBar.delete")}
            disabled={names.length === 1}
          />
        </Grid>
      ))}
      <Button
        variant="subtle"
        icon={<Add24Regular />}
        onClick={() => setNames((prev) => [...prev, ""])}
      >
        {t("actionBar.create")}
      </Button>
      <FormField label={<>{t("businessData.shiftDefinition.clone.comment")}</>}>
        <Input value={comment} onChange={setComment} />
      </FormField>
    </BaseDialog>
  );
}
