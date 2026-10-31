import type { BarcodeEntityInfo } from "@/api";
import { BaseDialog, DialogFooter } from "@/components/common";
import { makeStyles, Text, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const useInfoStyles = makeStyles({
  rows: {
    display: "flex",
    flexDirection: "column",
    rowGap: "14px",
    padding: "8px 0",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    columnGap: "12px",
    alignItems: "baseline",
    fontSize: "13px",
  },
  label: {
    textAlign: "right",
    color: tokens.colorNeutralForeground3,
  },
});

const L: Record<string, TranslationKey> = {
  close: "common.close",
};

interface EntityInfoDialogProps {
  info: BarcodeEntityInfo | null;
  onClose: () => void;
}

export function EntityInfoDialog({ info, onClose }: EntityInfoDialogProps) {
  const { t } = useAppTranslation();
  const styles = useInfoStyles();
  const sharedStyles = useSharedStyles();

  return (
    <BaseDialog
      open={info !== null}
      title={info ? t(info.titleKey as TranslationKey) : ""}
      size="lg"
      onClose={onClose}
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.close)} hideCancel />
      }
    >
      <div className={styles.rows}>
        {info?.rows.map((row) => (
          <div key={row.labelKey} className={styles.row}>
            <Text className={styles.label}>{t(row.labelKey as TranslationKey)}:</Text>
            {row.link ? (
              <a
                className={sharedStyles.tableLink}
                href="#"
                onClick={(event) => event.preventDefault()}
              >
                {row.value}
              </a>
            ) : (
              <Text>{row.value}</Text>
            )}
          </div>
        ))}
      </div>
    </BaseDialog>
  );
}
