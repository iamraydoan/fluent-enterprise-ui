import { useState } from "react";
import { BaseDialog, DialogEntityBanner, WizardSteps } from "@/components/common";
import { Button } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

interface GenerateScheduleScenarioDialogProps {
  open: boolean;
  onClose: () => void;
  scenarioName: string;
}

const STEP_KEYS: TranslationKey[] = [
  "businessData.scheduleScenario.dialogs.generate.step1",
  "businessData.scheduleScenario.dialogs.generate.step2",
  "businessData.scheduleScenario.dialogs.generate.step3",
];

const BODIES: TranslationKey[] = [
  "businessData.scheduleScenario.dialogs.generate.step1Body",
  "businessData.scheduleScenario.dialogs.generate.step2Body",
  "businessData.scheduleScenario.dialogs.generate.step3Body",
];

export function GenerateScheduleScenarioDialog({
  open,
  onClose,
  scenarioName,
}: GenerateScheduleScenarioDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.scheduleScenario.dialogs.generate";
  const [step, setStep] = useState(1);

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(900px, 90vw)"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              {t("common.back")}
            </Button>
          )}
          {step < 3 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)}>
              {t("common.next")}
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose}>
              {t(`${k}.generate`)}
            </Button>
          )}
        </>
      }
    >
      <DialogEntityBanner icon="📊" name={scenarioName} />
      <WizardSteps steps={STEP_KEYS.map((key) => t(key))} current={step} />
      <div style={{ padding: "12px 0", color: theme.color.textSecondary }}>
        {t(BODIES[step - 1])}
      </div>
    </BaseDialog>
  );
}
