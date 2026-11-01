import { IconButton } from "@/components/common";
import { Dismiss16Regular, Warning20Filled } from "@/components/icons";
import { Button, Text, makeStyles} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { cardSurface } from "@/styles/shared";
import { theme } from "@/styles/theme";

const useConfirmStyles = makeStyles({
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
    width: "min(480px, calc(100vw - 48px))",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    ...cardSurface,
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "52px",
    padding: "0 16px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    flexShrink: 0,
  },
  body: {
    display: "flex",
    columnGap: "12px",
    padding: "20px 24px",
    alignItems: "flex-start",
  },
  warningIcon: { color: theme.color.textWarning, flexShrink: 0, marginTop: "2px" },
  dangerIcon: { color: theme.color.textDanger, flexShrink: 0, marginTop: "2px" },
  foot: {
    display: "flex",
    justifyContent: "flex-end",
    columnGap: "8px",
    padding: "12px 24px",
    borderTop: `1px solid ${theme.color.borderSubtle}`,
  },
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
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.surface} onClick={(event) => event.stopPropagation()}>
        <div className={styles.head}>
          <Text weight="semibold">{t(titleKey)}</Text>
          <IconButton icon={<Dismiss16Regular />} onClick={onClose} ariaLabel={t("common.close")} />
        </div>
        <div className={styles.body}>
          <span className={danger ? styles.dangerIcon : styles.warningIcon}>
            <Warning20Filled />
          </span>
          <Text>{t(messageKey, messageParams)}</Text>
        </div>
        <div className={styles.foot}>
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
        </div>
      </div>
    </div>
  );
}
