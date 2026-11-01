import {
  useState,
} from "react";
import {
  BaseDialog, DialogFooter, HStack,
} from "@/components/common";
import {
  Button, Input,
} from "@/components/ui";
import {
  useAppTranslation,
} from "@/i18n";
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


export function ManageConfigurationsDialog({
  name,
  onClose,
}: {
  name: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const [configurations, setConfigurations] = useState<string[]>([]);

  return (
    <BaseDialog
      open
      title={`${t(L.configurationsTitle)} ${name}`}
      width="640px"
      onClose={onClose}
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.update)} />}
    >
      <HStack gap="8px" align="center">
        <Button size="sm" onClick={() => setConfigurations([...configurations, ""])}>
          + {t(L.addConfiguration)}
        </Button>
      </HStack>
      {configurations.map((c, i) => (
        <HStack gap="8px" align="center" key={i}>
          <Input
            placeholder={t(L.configurationName)}
            value={c}
            onChange={(value) =>
              setConfigurations(configurations.map((x, j) => (j === i ? value : x)))
            }
          />
          <Button
            size="sm"
            onClick={() => setConfigurations(configurations.filter((_, j) => j !== i))}
          >
            {t(L.remove)}
          </Button>
        </HStack>
      ))}
    </BaseDialog>
  );
}

export function ManageStepsDialog({ name, onClose }: { name: string; onClose: () => void }) {
  const { t } = useAppTranslation();
  const [steps, setSteps] = useState<{ name: string; inProcess: boolean }[]>([]);

  return (
    <BaseDialog
      open
      title={`${t(L.stepsTitle)} ${name}`}
      width="640px"
      onClose={onClose}
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.update)} />}
    >
      <HStack gap="8px" align="center">
        <Button size="sm" onClick={() => setSteps([...steps, { name: "", inProcess: false }])}>
          + {t(L.addStep)}
        </Button>
      </HStack>
      {steps.map((s, i) => (
        <HStack gap="8px" align="center" key={i}>
          <Input
            placeholder={t(L.stepName)}
            value={s.name}
            onChange={(value) =>
              setSteps(steps.map((x, j) => (j === i ? { ...x, name: value } : x)))
            }
          />
          <Button size="sm" onClick={() => setSteps(steps.filter((_, j) => j !== i))}>
            {t(L.remove)}
          </Button>
        </HStack>
      ))}
    </BaseDialog>
  );
}
