import { useState } from "react";
import { BaseDialog } from "@/components/common";
import { Button, Textarea } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useDialogStyles } from "./dialogStyles";

export function CommentConfirmDialog({
  open,
  titleKey,
  messageKey,
  messageParams,
  confirmLabelKey,
  onClose,
  onConfirm,
}: {
  open: boolean;
  titleKey: TranslationKey;
  messageKey: TranslationKey;
  messageParams?: Record<string, string>;
  confirmLabelKey: TranslationKey;
  onClose: () => void;
  onConfirm: (comment: string) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [comment, setComment] = useState("");
  return (
    <BaseDialog
      open={open}
      size="md"
      title={t(titleKey)}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={() => onConfirm(comment)}>
            {t(confirmLabelKey)}
          </Button>
        </>
      }
    >
      <div className={styles.hint}>{t(messageKey, messageParams)}</div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.dataCollection.operations.comment")}
        </span>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </BaseDialog>
  );
}
