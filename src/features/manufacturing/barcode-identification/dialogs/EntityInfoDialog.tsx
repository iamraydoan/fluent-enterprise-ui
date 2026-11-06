import type { BarcodeEntityInfo } from "@/api";
import { BaseDialog, DialogFooter, Grid, VStack } from "@/components/common";
import { makeStyles, Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";

const useInfoStyles = makeStyles({
  rows: {
    padding: "8px 0",
  },
  row: {
    fontSize: "13px",
  },
  label: {
    textAlign: "right",
    color: theme.color.textTertiary,
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
      <VStack gap="14px" className={styles.rows}>
        {info?.rows.map((row) => (
          <Grid
            columns="220px 1fr"
            gap="12px"
            align="baseline"
            key={row.labelKey}
            className={styles.row}
          >
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
          </Grid>
        ))}
      </VStack>
    </BaseDialog>
  );
}
