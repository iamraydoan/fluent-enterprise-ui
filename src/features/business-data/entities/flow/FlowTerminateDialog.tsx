import { Button, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { TERMINATE } from "./wizardMode";
import type { TerminateMode } from "./wizardMode";


const L: Record<string, TranslationKey> = {
  terminateTitle: "businessData.flow.terminateDialog.title",
  terminateMessage: "businessData.flow.terminateDialog.message",
  unterminateTitle: "businessData.flow.terminateDialog.unterminateTitle",
  unterminateMessage: "businessData.flow.terminateDialog.unterminateMessage",
  cancel: "businessData.flow.terminateDialog.cancel",
  terminate: "businessData.flow.terminateDialog.terminate",
  unterminate: "businessData.flow.terminateDialog.unterminate",
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
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

export function FlowTerminateDialog({
  name,
  mode,
  onClose,
}: {
  name: string;
  mode: TerminateMode;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
  const isTerminate = mode === TERMINATE;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>{t(isTerminate ? L.terminateTitle : L.unterminateTitle)}</div>
        <div className={styles.body}>
          <div>{t(isTerminate ? L.terminateMessage : L.unterminateMessage, { name })}</div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button
            appearance="primary"
            onClick={onClose}
            style={isTerminate ? { backgroundColor: tokens.colorPaletteRedBackground3 } : undefined}
          >
            {t(isTerminate ? L.terminate : L.unterminate)}
          </Button>
        </div>
      </div>
    </div>
  );
}
