import { Button, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { useState } from "react";
import { TERMINATE } from "./wizardMode";
import type { MaoAction, TerminateMode } from "./wizardMode";


const L: Record<string, TranslationKey> = {
  terminateTitle: "businessData.maintenanceActivityOrder.terminateDialog.title",
  terminateMessage: "businessData.maintenanceActivityOrder.terminateDialog.message",
  unterminateTitle: "businessData.maintenanceActivityOrder.terminateDialog.unterminateTitle",
  unterminateMessage: "businessData.maintenanceActivityOrder.terminateDialog.unterminateMessage",
  cancel: "businessData.maintenanceActivityOrder.terminateDialog.cancel",
  terminate: "businessData.maintenanceActivityOrder.terminateDialog.terminate",
  unterminate: "businessData.maintenanceActivityOrder.terminateDialog.unterminate",
  changeStateTitle: "businessData.maintenanceActivityOrder.changeState.title",
  changeStateMessage: "businessData.maintenanceActivityOrder.changeState.message",
  comment: "businessData.maintenanceActivityOrder.changeState.comment",
  confirm: "businessData.maintenanceActivityOrder.changeState.confirm",
  approve: "businessData.maintenanceActivityOrder.changeState.approve",
  release: "businessData.maintenanceActivityOrder.changeState.release",
  begin: "businessData.maintenanceActivityOrder.changeState.begin",
  complete: "businessData.maintenanceActivityOrder.changeState.complete",
  accept: "businessData.maintenanceActivityOrder.changeState.accept",
  reject: "businessData.maintenanceActivityOrder.changeState.reject",
  cancelAction: "businessData.maintenanceActivityOrder.changeState.cancelAction",
  skip: "businessData.maintenanceActivityOrder.changeState.skip",
  abort: "businessData.maintenanceActivityOrder.changeState.abort",
  rework: "businessData.maintenanceActivityOrder.changeState.rework",
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

export function MaintenanceActivityOrderTerminateDialog({
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
      <div className={`${shared.contentCard} ${styles.surface}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
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

const ACTION_LABELS: Record<MaoAction, TranslationKey> = {
  approve: L.approve,
  release: L.release,
  begin: L.begin,
  complete: L.complete,
  accept: L.accept,
  reject: L.reject,
  cancelAction: L.cancelAction,
  skip: L.skip,
  abort: L.abort,
  rework: L.rework,
};

export function MaoChangeStateDialog({
  name,
  action,
  onClose,
}: {
  name: string;
  action: MaoAction;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
  const [comment, setComment] = useState("");
  const actionLabel = t(ACTION_LABELS[action]);

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={`${shared.contentCard} ${styles.surface}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.head}>{t(L.changeStateTitle, { action: actionLabel })}</div>
        <div className={styles.body}>
          <div>{t(L.changeStateMessage, { action: actionLabel, name })}</div>
          <Textarea
            placeholder={t(L.comment)}
            value={comment}
            onChange={(_, d) => setComment(d.value)}
          />
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t(L.confirm)}
          </Button>
        </div>
      </div>
    </div>
  );
}
