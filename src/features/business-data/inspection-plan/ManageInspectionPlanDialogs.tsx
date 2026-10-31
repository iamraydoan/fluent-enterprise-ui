import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Button, Input, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

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

const useStyles = makeStyles({
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
  const styles = useStyles();
  const [configurations, setConfigurations] = useState<string[]>([]);

  return (
    <BaseDialog
      open
      title={`${t(L.configurationsTitle)} ${name}`}
      width="640px"
      onClose={onClose}
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.update)} />}
    >
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
    </BaseDialog>
  );
}

export function ManageStepsDialog({ name, onClose }: { name: string; onClose: () => void }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const [steps, setSteps] = useState<{ name: string; inProcess: boolean }[]>([]);

  return (
    <BaseDialog
      open
      title={`${t(L.stepsTitle)} ${name}`}
      width="640px"
      onClose={onClose}
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.update)} />}
    >
      <div className={styles.row}>
        <Button size="small" onClick={() => setSteps([...steps, { name: "", inProcess: false }])}>
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
    </BaseDialog>
  );
}
