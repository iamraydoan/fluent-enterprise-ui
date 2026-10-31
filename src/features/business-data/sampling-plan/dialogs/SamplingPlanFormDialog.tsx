import { useState } from "react";
import type { SamplingPlanDetail, SamplingPlanRecord, SamplingPlanType } from "@/api";
import { BaseDialog } from "@/components/common";
import { Body1Strong, Button, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

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
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          {!nameReadOnly && step === 2 && (
            <Button appearance="secondary" onClick={() => setStep(1)}>
              {t("common.back")}
            </Button>
          )}
          {!nameReadOnly && step === 1 ? (
            <Button appearance="primary" onClick={() => setStep(2)}>
              {t("common.next")}
            </Button>
          ) : (
            <Button appearance="primary" onClick={onClose}>
              {submitLabel}
            </Button>
          )}
        </>
      }
    >
      {!nameReadOnly && (
        <div style={{ display: "flex", alignItems: "center", columnGap: 8, marginBottom: 12 }}>
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: step === 1 ? "#0078d4" : "#ccc",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
            }}
          >
            1
          </span>
          <Body1Strong>{t(`${k}.generalData`)}</Body1Strong>
          <span style={{ width: 40, height: 1, backgroundColor: "#ccc" }} />
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: step === 2 ? "#0078d4" : "#ccc",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
            }}
          >
            2
          </span>
          <Body1Strong>{t(`${k}.context`)}</Body1Strong>
        </div>
      )}

      {(step === 1 || nameReadOnly) && (
        <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
          <Field label={t(`${k}.name`)} required>
            <Input value={name} readOnly={nameReadOnly} onChange={(_, d) => setName(d.value)} />
          </Field>
          <Field label={t(`${k}.description`)}>
            <Input value={description} onChange={(_, d) => setDescription(d.value)} />
          </Field>
          <Field label={t(`${k}.type`)}>
            <Input value={type} onChange={(_, d) => setType(d.value)} />
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
            <Input value={counterFrequency} onChange={(_, d) => setCounterFrequency(d.value)} />
          </Field>
          <Field label={t(`${k}.timeFrequency`)}>
            <Input value={timeFrequency} onChange={(_, d) => setTimeFrequency(d.value)} />
          </Field>
        </div>
      )}

      {step === 2 && !nameReadOnly && (
        <div style={{ padding: "12px 0", color: "#666" }}>{t(`${k}.contextBody`)}</div>
      )}

      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={(_, d) => setComments(d.value)} />
      </Field>
    </BaseDialog>
  );
}
