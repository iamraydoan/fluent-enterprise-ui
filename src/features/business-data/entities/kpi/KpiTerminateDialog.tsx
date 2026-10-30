import { Button, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const L: Record<string, TranslationKey> = {
  title: "businessData.kpi.terminateDialog.title",
  message: "businessData.kpi.terminateDialog.message",
  warning: "businessData.kpi.terminateDialog.warning",
  cancel: "businessData.kpi.terminateDialog.cancel",
  terminate: "businessData.kpi.terminateDialog.terminate",
};

const useDialogStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  surface: { width: "480px", maxWidth: "95vw", display: "flex", flexDirection: "column" },
  head: {
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
  },
  body: { padding: "16px", display: "flex", flexDirection: "column", gap: "12px" },
  warning: {
    padding: "10px 12px",
    backgroundColor: tokens.colorPaletteRedBackground1,
    color: tokens.colorPaletteRedForeground1,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase300,
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

export function KpiTerminateDialog({ name, onClose }: { name: string; onClose: () => void }) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>{t(L.title)}</div>
        <div className={styles.body}>
          <div>{t(L.message, { name })}</div>
          <div className={styles.warning}>{t(L.warning)}</div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button
            appearance="primary"
            onClick={onClose}
            style={{ backgroundColor: tokens.colorPaletteRedBackground3 }}
          >
            {t(L.terminate)}
          </Button>
        </div>
      </div>
    </div>
  );
}
