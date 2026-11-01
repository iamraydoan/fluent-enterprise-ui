import { useState } from "react";
import type { SamplingPlanDetail, SamplingPlanRecord, SamplingPlanType } from "@/api";
import { BaseDialog, WizardSteps } from "@/components/common";
import { Body1Strong, Button, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

interface SamplingPlanFormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  initial?: Partial<SamplingPlanDetail & SamplingPlanRecord>;
  nameReadOnly?: boolean;
  submitLabel: string;
}

const SAMPLING_TYPES: SamplingPlanType[] = ["CounterBased", "CounterAndTimeBased", "TimeBased"];

export function SamplingPlanFormDialog({
  open,
  onClose,
  title,
  initial,
  nameReadOnly,
  submitLabel,
}: SamplingPlanFormDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.samplingPlan.dialogs.form";
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [type, setType] = useState(initial?.type ?? "Lot-based");
  const [defaultSamplingType, setDefaultSamplingType] = useState<SamplingPlanType>(
    initial?.defaultSamplingType ?? "CounterBased",
  );
  const [counterFrequency, setCounterFrequency] = useState(String(initial?.counterFrequency ?? 10));
  const [timeFrequency, setTimeFrequency] = useState(String(initial?.timeFrequency ?? 24));
  const [comments, setComments] = useState("");

  return (
    <BaseDialog
      open={open}
      title={title}
      onClose={onClose}
      width="min(900px, 90vw)"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          {!nameReadOnly && step === 2 && (
            <Button variant="secondary" onClick={() => setStep(1)}>
              {t("common.back")}
            </Button>
          )}
          {!nameReadOnly && step === 1 ? (
            <Button variant="primary" onClick={() => setStep(2)}>
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
<WizardSteps steps={[t(`${k}.generalData`), t(`${k}.context`)]} current={step} />
      )}

      {(step === 1 || nameReadOnly) && (
        <div style={{ display: "flex", flexDirection: "column", rowGap: theme.spacing.md }}>
          <Field label={t(`${k}.name`)} required>
            <Input value={name} readOnly={nameReadOnly} onChange={setName} />
          </Field>
          <Field label={t(`${k}.description`)}>
            <Input value={description} onChange={setDescription} />
          </Field>
          <Field label={t(`${k}.type`)}>
            <Input value={type} onChange={setType} />
          </Field>
          <Body1Strong>{t(`${k}.defaultSampling`)}</Body1Strong>
          <Field label={t(`${k}.samplingType`)}>
            <select
              value={defaultSamplingType}
              onChange={(e) => setDefaultSamplingType(e.target.value as SamplingPlanType)}
            >
              {SAMPLING_TYPES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t(`${k}.counterFrequency`)}>
            <Input value={counterFrequency} onChange={setCounterFrequency} />
          </Field>
          <Field label={t(`${k}.timeFrequency`)}>
            <Input value={timeFrequency} onChange={setTimeFrequency} />
          </Field>
        </div>
      )}

      {step === 2 && !nameReadOnly && (
        <div style={{ padding: `${theme.spacing.md} 0`, color: theme.color.textTertiary }}>{t(`${k}.contextBody`)}</div>
      )}

      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={setComments} />
      </Field>
    </BaseDialog>
  );
}
