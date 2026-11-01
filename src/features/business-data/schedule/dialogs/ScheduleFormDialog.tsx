import { useState } from "react";
import type { ScheduleDetail, ScheduleRecord } from "@/api";
import { BaseDialog, WizardSteps } from "@/components/common";
import { Body1Strong, Button, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

interface ScheduleFormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  initial?: Partial<ScheduleDetail & ScheduleRecord>;
  nameReadOnly?: boolean;
  submitLabel: string;
}

const VIEW_OPTIONS = ["Gantt", "Table"];
const TYPE_OPTIONS = ["Forwards", "Backwards"];

const STEP_KEYS: TranslationKey[] = [
  "businessData.schedule.dialogs.form.step1",
  "businessData.schedule.dialogs.form.step2",
  "businessData.schedule.dialogs.form.step3",
  "businessData.schedule.dialogs.form.step4",
];

export function ScheduleFormDialog({
  open,
  onClose,
  title,
  initial,
  nameReadOnly,
  submitLabel,
}: ScheduleFormDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.schedule.dialogs.form";
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [defaultView, setDefaultView] = useState(initial?.defaultView ?? "Gantt");
  const [defaultFrozenPeriod, setDefaultFrozenPeriod] = useState(
    String(initial?.defaultFrozenPeriod ?? 4),
  );
  const [timeQuantum, setTimeQuantum] = useState(String(initial?.timeQuantum ?? 5));
  const [schedulingType, setSchedulingType] = useState("Forwards");
  const [comments, setComments] = useState("");

  return (
    <BaseDialog
      open={open}
      title={title}
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
              {submitLabel}
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
          <Field label={t(`${k}.defaultView`)}>
            <select value={defaultView} onChange={(e) => setDefaultView(e.target.value)}>
              {VIEW_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t(`${k}.defaultFrozenPeriod`)}>
            <Input
              value={defaultFrozenPeriod}
              onChange={setDefaultFrozenPeriod}
            />
          </Field>
          <Field label={t(`${k}.timeQuantum`)}>
            <Input value={timeQuantum} onChange={setTimeQuantum} />
          </Field>
        </div>
      )}

      {step === 2 && !nameReadOnly && (
        <div style={{ display: "flex", flexDirection: "column", rowGap: theme.spacing.md }}>
          <Body1Strong>{t(`${k}.schedulingType`)}</Body1Strong>
          <Field label={t(`${k}.type`)}>
            <select value={schedulingType} onChange={(e) => setSchedulingType(e.target.value)}>
              {TYPE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <div style={{ padding: `${theme.spacing.md} 0`, color: theme.color.textTertiary }}>{t(`${k}.optimizationBody`)}</div>
        </div>
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
