import { useState } from "react";
import { BaseDialog, WizardSteps } from "@/components/common";
import { Button, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

interface ScheduleScenarioFormDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  initialName?: string;
  nameReadOnly?: boolean;
  submitLabel?: string;
}

const TYPE_OPTIONS = ["OperationalAccurate", "OperationalFast", "Planning"];

const STEP_KEYS: TranslationKey[] = [
  "businessData.scheduleScenario.dialogs.form.step1",
  "businessData.scheduleScenario.dialogs.form.step2",
  "businessData.scheduleScenario.dialogs.form.step3",
  "businessData.scheduleScenario.dialogs.form.step4",
];

export function ScheduleScenarioFormDialog({
  open,
  onClose,
  title,
  initialName,
  nameReadOnly,
  submitLabel,
}: ScheduleScenarioFormDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.scheduleScenario.dialogs.form";
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initialName ?? "");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");
  const [generationType, setGenerationType] = useState(TYPE_OPTIONS[0]);
  const [comments, setComments] = useState("");

  const resolvedTitle = title ?? t(`${k}.createTitle`);
  const resolvedSubmit = submitLabel ?? t("actionBar.create");

  return (
    <BaseDialog
      open={open}
      title={resolvedTitle}
      onClose={onClose}
      width="min(950px, 92vw)"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          {!nameReadOnly && step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              {t("common.back")}
            </Button>
          )}
          {!nameReadOnly && step < 4 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)}>
              {t("common.next")}
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose}>
              {resolvedSubmit}
            </Button>
          )}
        </>
      }
    >
      {!nameReadOnly && (
                <WizardSteps steps={STEP_KEYS.map((key) => t(key))} current={step} />
      )}

      {(step === 1 || nameReadOnly) && (
        <div style={{ display: "flex", flexDirection: "column", rowGap: theme.spacing.md }}>
          <Field label={t(`${k}.name`)} required>
            <Input value={name} readOnly={nameReadOnly} onChange={setName} />
          </Field>
          <Field label={t(`${k}.description`)}>
            <Input value={description} onChange={setDescription} />
          </Field>
          <Field label={t(`${k}.schedule`)} required>
            <Input value={schedule} onChange={setSchedule} />
          </Field>
          <Field label={t(`${k}.generationType`)}>
            <select value={generationType} onChange={(e) => setGenerationType(e.target.value)}>
              {TYPE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}

      {step === 2 && !nameReadOnly && (
        <div style={{ padding: `${theme.spacing.md} 0`, color: theme.color.textTertiary }}>{t(`${k}.optimizationBody`)}</div>
      )}

      {step === 3 && !nameReadOnly && (
        <div style={{ padding: `${theme.spacing.md} 0`, color: theme.color.textTertiary }}>{t(`${k}.untieBody`)}</div>
      )}

      {step === 4 && !nameReadOnly && (
        <div style={{ padding: `${theme.spacing.md} 0`, color: theme.color.textTertiary }}>{t(`${k}.automaticBody`)}</div>
      )}

      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={setComments} />
      </Field>
    </BaseDialog>
  );
}
