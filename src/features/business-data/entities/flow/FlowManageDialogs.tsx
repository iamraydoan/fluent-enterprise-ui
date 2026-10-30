import { useState } from "react";
import { Button, Input, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const L: Record<string, TranslationKey> = {
  logicalNamesTitle: "businessData.flow.manageDialog.logicalNamesTitle",
  logicalName: "businessData.flow.manageDialog.logicalName",
  addLogicalName: "businessData.flow.manageDialog.addLogicalName",
  remove: "businessData.flow.manageDialog.remove",
  update: "businessData.flow.manageDialog.update",
  cancel: "businessData.flow.manageDialog.cancel",
  reworkPathsTitle: "businessData.flow.manageDialog.reworkPathsTitle",
  filterByStep: "businessData.flow.manageDialog.filterByStep",
  close: "businessData.flow.manageDialog.close",
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
  surface: {
    width: "600px",
    maxWidth: "95vw",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
  },
  head: {
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
  },
  body: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflowY: "auto",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  row: { display: "flex", gap: "8px", alignItems: "center" },
  field: { display: "grid", gridTemplateColumns: "150px 1fr", gap: "12px", alignItems: "center" },
});

export function FlowLogicalNamesDialog({ onClose }: { onClose: () => void }) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
  const [names, setNames] = useState<string[]>([]);

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>{t(L.logicalNamesTitle)}</div>
        <div className={styles.body}>
          <div className={styles.row}>
            <Button size="small" onClick={() => setNames([...names, ""])}>
              + {t(L.addLogicalName)}
            </Button>
          </div>
          {names.map((n, i) => (
            <div key={i} className={styles.row}>
              <Input
                placeholder={t(L.logicalName)}
                value={n}
                onChange={(_, d) => setNames(names.map((x, j) => (j === i ? d.value : x)))}
              />
              <Button size="small" onClick={() => setNames(names.filter((_, j) => j !== i))}>
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

export function FlowReworkPathsDialog({ onClose }: { onClose: () => void }) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
  const [filter, setFilter] = useState("");

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>{t(L.reworkPathsTitle)}</div>
        <div className={styles.body}>
          <div className={styles.field}>
            <label>{t(L.filterByStep)}</label>
            <Input value={filter} onChange={(_, d) => setFilter(d.value)} />
          </div>
        </div>
        <div className={styles.footer}>
          <Button appearance="primary" onClick={onClose}>
            {t(L.close)}
          </Button>
        </div>
      </div>
    </div>
  );
}
