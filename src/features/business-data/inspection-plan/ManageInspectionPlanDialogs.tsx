import { useState } from "react";
import { Button, Input, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const L: Record<string, TranslationKey> = {
  configurationsTitle: "businessData.inspectionPlan.manageConfigurations.title",
  configurations: "businessData.inspectionPlan.manageConfigurations.configurations",
  addConfiguration: "businessData.inspectionPlan.manageConfigurations.addConfiguration",
  removeConfiguration: "businessData.inspectionPlan.manageConfigurations.removeConfiguration",
  configurationName: "businessData.inspectionPlan.manageConfigurations.configurationName",
  stepsTitle: "businessData.inspectionPlan.manageSteps.title",
  steps: "businessData.inspectionPlan.manageSteps.steps",
  addStep: "businessData.inspectionPlan.manageSteps.addStep",
  removeStep: "businessData.inspectionPlan.manageSteps.removeStep",
  stepName: "businessData.inspectionPlan.manageSteps.stepName",
  isInProcessInspection: "businessData.inspectionPlan.manageSteps.isInProcessInspection",
  cancel: "businessData.inspectionPlan.manageConfigurations.cancel",
  update: "businessData.inspectionPlan.manageConfigurations.update",
  remove: "businessData.inspectionPlan.dialog.remove",
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
    width: "640px",
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
});

export function ManageConfigurationsDialog({
  name,
  onClose,
}: {
  name: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
  const [configurations, setConfigurations] = useState<string[]>([]);

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>
          {t(L.configurationsTitle)} {name}
        </div>
        <div className={styles.body}>
          <div className={styles.row}>
            <Button size="small" onClick={() => setConfigurations([...configurations, ""])}>
              + {t(L.addConfiguration)}
            </Button>
          </div>
          {configurations.map((c, i) => (
            <div key={i} className={styles.row}>
              <Input
                placeholder={t(L.configurationName)}
                value={c}
                onChange={(_, d) =>
                  setConfigurations(configurations.map((x, j) => (j === i ? d.value : x)))
                }
              />
              <Button
                size="small"
                onClick={() => setConfigurations(configurations.filter((_, j) => j !== i))}
              >
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

export function ManageStepsDialog({ name, onClose }: { name: string; onClose: () => void }) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
  const [steps, setSteps] = useState<{ name: string; inProcess: boolean }[]>([]);

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>
          {t(L.stepsTitle)} {name}
        </div>
        <div className={styles.body}>
          <div className={styles.row}>
            <Button
              size="small"
              onClick={() => setSteps([...steps, { name: "", inProcess: false }])}
            >
              + {t(L.addStep)}
            </Button>
          </div>
          {steps.map((s, i) => (
            <div key={i} className={styles.row}>
              <Input
                placeholder={t(L.stepName)}
                value={s.name}
                onChange={(_, d) =>
                  setSteps(steps.map((x, j) => (j === i ? { ...x, name: d.value } : x)))
                }
              />
              <Button size="small" onClick={() => setSteps(steps.filter((_, j) => j !== i))}>
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
