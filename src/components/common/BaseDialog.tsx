import { Dismiss16Regular } from "@/components/icons";
import { Button, Text, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { cardSurface } from "@/styles/shared";

const useBaseDialogStyles = makeStyles({
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
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    maxHeight: "calc(100vh - 48px)",
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
  body: {
    padding: "16px 20px",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    rowGap: "12px",
  },
  foot: {
    display: "flex",
    justifyContent: "flex-end",
    columnGap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
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
});

export type DialogSize = "sm" | "md" | "lg" | "xl";

const SIZE_WIDTHS: Record<DialogSize, string> = {
  sm: "480px",
  md: "560px",
  lg: "720px",
  xl: "920px",
};

interface BaseDialogProps {
  open: boolean;
  title: string;
  size?: DialogSize;
  width?: string;
  onClose: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function BaseDialog({
  open,
  title,
  size = "md",
  width,
  onClose,
  footer,
  children,
}: BaseDialogProps) {
  const styles = useBaseDialogStyles();
  const { t } = useAppTranslation();

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={styles.surface}
        style={{ width: width ?? SIZE_WIDTHS[size], maxWidth: "calc(100vw - 48px)" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={styles.head}>
          <Text weight="semibold" size={400}>
            {title}
          </Text>
          <button className={styles.closeButton} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss16Regular />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.foot}>{footer}</div>}
      </div>
    </div>
  );
}

interface DialogFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  confirmAppearance?: "primary" | "secondary";
  danger?: boolean;
}

export function DialogFooter({
  onCancel,
  onConfirm,
  confirmLabel,
  confirmAppearance = "primary",
  danger = false,
}: DialogFooterProps) {
  const { t } = useAppTranslation();
  return (
    <>
      <Button appearance="secondary" onClick={onCancel}>
        {t("common.cancel")}
      </Button>
      <Button
        appearance={confirmAppearance}
        onClick={onConfirm}
        style={danger ? { backgroundColor: tokens.colorPaletteRedBackground3 } : undefined}
      >
        {confirmLabel}
      </Button>
    </>
  );
}
