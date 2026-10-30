import { useState } from "react";
import { Button, Input, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const tk = (key: string) => key as TranslationKey;

const L = {
  manageDelegatesTitle: tk("businessData.employee.delegates.manageDelegatesTitle"),
  manageTraineesTitle: tk("businessData.employee.delegates.manageTraineesTitle"),
  delegateEmployee: tk("businessData.employee.delegates.delegateEmployee"),
  validFrom: tk("businessData.employee.delegates.validFrom"),
  validTo: tk("businessData.employee.delegates.validTo"),
  addDelegate: tk("businessData.employee.delegates.addDelegate"),
  addTrainee: tk("businessData.employee.delegates.addTrainee"),
  cancel: tk("businessData.employee.delegates.cancel"),
  update: tk("businessData.employee.delegates.update"),
  checkOut: tk("businessData.employee.delegates.checkOut"),
  remove: tk("businessData.employee.dialog.remove"),
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
  surface: { width: "720px", maxWidth: "95vw", display: "flex", flexDirection: "column", maxHeight: "90vh" },
  head: {
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
  },
  body: { padding: "16px", display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  row: { display: "flex", gap: "8px", alignItems: "center" },
});

interface DialogProps {
  name: string;
  onClose: () => void;
}

export function ManageDelegatesDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
  const [delegates, setDelegates] = useState<{ employee: string; validFrom: string; validTo: string }[]>([]);

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={`${shared.contentCard} ${styles.surface}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.head}>
          {t(L.manageDelegatesTitle)} {name}
        </div>
        <div className={styles.body}>
          <div className={styles.row}>
            <Button
              size="small"
              onClick={() => setDelegates([...delegates, { employee: "", validFrom: "", validTo: "" }])}
            >
              + {t(L.addDelegate)}
            </Button>
          </div>
          {delegates.map((d, i) => (
            <div key={i} className={styles.row}>
              <Input
                placeholder={t(L.delegateEmployee)}
                value={d.employee}
                onChange={(_, v) => setDelegates(delegates.map((x, j) => (j === i ? { ...x, employee: v.value } : x)))}
              />
              <Input
                placeholder={t(L.validFrom)}
                value={d.validFrom}
                onChange={(_, v) => setDelegates(delegates.map((x, j) => (j === i ? { ...x, validFrom: v.value } : x)))}
              />
              <Input
                placeholder={t(L.validTo)}
                value={d.validTo}
                onChange={(_, v) => setDelegates(delegates.map((x, j) => (j === i ? { ...x, validTo: v.value } : x)))}
              />
              <Button size="small" onClick={() => setDelegates(delegates.filter((_, j) => j !== i))}>
                {t(L.remove)}
              </Button>
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t(L.update)}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ManageTraineesDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
  const [trainees, setTrainees] = useState<string[]>([]);

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={`${shared.contentCard} ${styles.surface}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.head}>
          {t(L.manageTraineesTitle)} {name}
        </div>
        <div className={styles.body}>
          <div className={styles.row}>
            <Button size="small" onClick={() => setTrainees([...trainees, ""])}>
              + {t(L.addTrainee)}
            </Button>
          </div>
          {trainees.map((tr, i) => (
            <div key={i} className={styles.row}>
              <Input
                value={tr}
                onChange={(_, v) => setTrainees(trainees.map((x, j) => (j === i ? v.value : x)))}
              />
              <Button size="small" onClick={() => setTrainees(trainees.filter((_, j) => j !== i))}>
                {t(L.remove)}
              </Button>
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t(L.checkOut)}
          </Button>
        </div>
      </div>
    </div>
  );
}
