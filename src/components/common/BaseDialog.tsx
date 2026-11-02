import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown20Regular, ChevronUp20Regular, Dismiss16Regular } from "@/components/icons";
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
  headTitle: { display: "flex", alignItems: "center", columnGap: "10px" },
  subHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    ...cardSurface,
    flexShrink: 0,
    fontSize: "13px",
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
  comments: { borderTop: `1px solid ${tokens.colorNeutralStroke2}`, flexShrink: 0 },
  commentsBtn: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 40px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    color: "#444",
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

type DialogSize = "sm" | "md" | "lg" | "xl" | "fullscreen";

const SIZE_WIDTHS: Record<Exclude<DialogSize, "fullscreen">, string> = {
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
  icon?: ReactNode;
  subHeader?: ReactNode;
  headerExtra?: ReactNode;
  showComments?: boolean;
  children: React.ReactNode;
}

export function BaseDialog({
  open,
  title,
  size = "md",
  width,
  onClose,
  footer,
  icon,
  subHeader,
  headerExtra,
  showComments = false,
  children,
}: BaseDialogProps) {
  const styles = useBaseDialogStyles();
  const { t } = useAppTranslation();
  const [commentsOpen, setCommentsOpen] = useState(false);

  if (!open) return null;

  const isFullscreen = size === "fullscreen";
  const surfaceStyle = isFullscreen
    ? { width: "calc(100vw - 48px)", height: "calc(100vh - 48px)" }
    : { width: width ?? SIZE_WIDTHS[size], maxWidth: "calc(100vw - 48px)" };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={styles.surface}
        style={surfaceStyle}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div style={headerExtra ? { backgroundColor: "#DDE1E7", flexShrink: 0 } : undefined}>
          <div className={styles.head}>
            <span className={styles.headTitle}>
              {icon}
              <Text weight="semibold" size={400}>
                {title}
              </Text>
            </span>
            <button className={styles.closeButton} onClick={onClose} aria-label={t("common.close")}>
              <Dismiss16Regular />
            </button>
          </div>
          {headerExtra}
        </div>
        {subHeader && <div className={styles.subHeader}>{subHeader}</div>}
        <div className={styles.body}>{children}</div>
        {showComments && (
          <div className={styles.comments}>
            <button
              className={styles.commentsBtn}
              onClick={() => setCommentsOpen((open) => !open)}
              aria-expanded={commentsOpen}
            >
              {t("dialogs.commentsLabel")}
              {commentsOpen ? <ChevronDown20Regular /> : <ChevronUp20Regular />}
            </button>
            {commentsOpen && (
              <div style={{ padding: "0 40px 12px" }}>
                <textarea
                  aria-label={t("dialogs.comments")}
                  rows={3}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    fontSize: 13,
                    padding: 8,
                  }}
                />
              </div>
            )}
          </div>
        )}
        {footer && <div className={styles.foot}>{footer}</div>}
      </div>
    </div>
  );
}

interface DialogFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  confirmVariant?: "primary" | "secondary";
  danger?: boolean;
  disabled?: boolean;
  hideCancel?: boolean;
  cancelLabel?: string;
}

export function DialogFooter({
  onCancel,
  onConfirm,
  confirmLabel,
  confirmVariant = "primary",
  danger = false,
  disabled = false,
  hideCancel = false,
  cancelLabel,
}: DialogFooterProps) {
  const { t } = useAppTranslation();
  return (
    <>
      {!hideCancel && (
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel ?? t("common.cancel")}
        </Button>
      )}
      <Button
        variant={confirmVariant}
        onClick={onConfirm}
        disabled={disabled}
        style={danger ? { backgroundColor: tokens.colorPaletteRedBackground3 } : undefined}
      >
        {confirmLabel}
      </Button>
    </>
  );
}
