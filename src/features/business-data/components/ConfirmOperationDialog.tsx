import { IconButton, Grid, HStack, VStack  } from "@/components/common";
import { Dismiss16Regular, Warning20Filled } from "@/components/icons";
import { Button, Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { cardSurface } from "@/styles/shared";
import { theme } from "@/styles/theme";

const useConfirmStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    placeItems: "center",
    padding: "24px",
    boxSizing: "border-box",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  surface: {
    width: "min(480px, calc(100vw - 48px))",
    overflow: "hidden",
    ...cardSurface,
  },
  head: {
    minHeight: "52px",
    padding: "0 16px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  closeButton: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: "6px",
    borderRadius: theme.radius.md,
    display: "flex",
    ":hover": { backgroundColor: theme.color.surfaceHover },
  },
  body: {
    padding: "20px 24px",
  },
  warningIcon: { color: theme.color.textWarning, flexShrink: 0, marginTop: "2px" },
  dangerIcon: { color: theme.color.textDanger, flexShrink: 0, marginTop: "2px" },
  foot: {
    padding: "12px 24px",
    borderTop: `1px solid ${theme.color.borderSubtle}`,
  }
});

interface ConfirmOperationDialogProps {
  open: boolean;
  titleKey: TranslationKey;
  messageKey: TranslationKey;
  messageParams?: Record<string, string>;
  confirmLabelKey: TranslationKey;
  danger?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmOperationDialog({
  open,
  titleKey,
  messageKey,
  messageParams,
  confirmLabelKey,
  danger = false,
  onClose,
  onConfirm,
}: ConfirmOperationDialogProps) {
  const { t } = useAppTranslation();
  const styles = useConfirmStyles();

  if (!open) return null;

  return (
    <Grid onClick={onClose} className={styles.overlay}>
      <VStack onClick={(event) => event.stopPropagation()} className={styles.surface}>
        <HStack align="center" justify="space-between" className={styles.head}>
          <Text weight="semibold">{t(titleKey)}</Text>
          <IconButton icon={<Dismiss16Regular />} onClick={onClose} aria-label={t("common.close")} size="sm" />
        </HStack>
        <HStack gap="12px" align="flex-start" className={styles.body}>
          <span className={danger ? styles.dangerIcon : styles.warningIcon}>
            <Warning20Filled />
          </span>
          <Text>{t(messageKey, messageParams)}</Text>
        </HStack>
        <HStack gap="8px" justify="flex-end" className={styles.foot}>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {t(confirmLabelKey)}
          </Button>
        </HStack>
      </VStack>
    </Grid>
  );
}
