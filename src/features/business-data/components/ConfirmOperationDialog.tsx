import { Dismiss16Regular, Warning20Filled } from "@/components/icons";
import { Button, Text, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { cardSurface } from "@/styles/shared";

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
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  closeButton: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: "6px",
    borderRadius: tokens.borderRadiusMedium,
    display: "flex",
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  body: {
    display: "flex",
    columnGap: "12px",
    padding: "20px 24px",
    alignItems: "flex-start",
  },
  warningIcon: { color: tokens.colorPaletteYellowForeground2, flexShrink: 0, marginTop: "2px" },
  dangerIcon: { color: tokens.colorPaletteRedForeground1, flexShrink: 0, marginTop: "2px" },
  foot: {
    display: "flex",
    justifyContent: "flex-end",
    columnGap: "8px",
    padding: "12px 24px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
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
          <button className={styles.closeButton} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss16Regular />
          </button>
        </div>
        <div className={styles.body}>
          <span className={danger ? styles.dangerIcon : styles.warningIcon}>
            <Warning20Filled />
          </span>
          <Text>{t(messageKey, messageParams)}</Text>
        </div>
        <div className={styles.foot}>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            appearance="primary"
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
