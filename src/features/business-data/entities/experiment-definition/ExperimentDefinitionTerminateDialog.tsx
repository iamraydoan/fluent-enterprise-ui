import { Button, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { TERMINATE } from "./wizardMode";
import type { TerminateMode } from "./wizardMode";


const L: Record<string, TranslationKey> = {
  terminateTitle: "businessData.experimentDefinition.terminateDialog.title",
  terminateMessage: "businessData.experimentDefinition.terminateDialog.message",
  unterminateTitle: "businessData.experimentDefinition.terminateDialog.unterminateTitle",
  unterminateMessage: "businessData.experimentDefinition.terminateDialog.unterminateMessage",
  cancel: "businessData.experimentDefinition.terminateDialog.cancel",
  terminate: "businessData.experimentDefinition.terminateDialog.terminate",
  unterminate: "businessData.experimentDefinition.terminateDialog.unterminate",
  setEffectiveTitle: "businessData.experimentDefinition.terminateDialog.setEffectiveTitle",
  setEffectiveMessage: "businessData.experimentDefinition.terminateDialog.setEffectiveMessage",
  setEffective: "businessData.experimentDefinition.terminateDialog.setEffective",
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

export function ExperimentDefinitionTerminateDialog({
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

export function SetEffectiveDialog({ name, onClose }: { name: string; onClose: () => void }) {
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
        <div className={styles.head}>{t(L.setEffectiveTitle)}</div>
        <div className={styles.body}>
          <div>{t(L.setEffectiveMessage, { name })}</div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t(L.setEffective)}
          </Button>
        </div>
      </div>
    </div>
  );
}
