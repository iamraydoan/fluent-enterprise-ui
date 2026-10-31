import { useState } from "react";
import { BaseDialog } from "@/components/common";
import { Body1Strong, Button, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

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
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          {!nameReadOnly && step > 1 && (
            <Button appearance="secondary" onClick={() => setStep(step - 1)}>
              {t("common.back")}
            </Button>
          )}
          {!nameReadOnly && step < 4 ? (
            <Button appearance="primary" onClick={() => setStep(step + 1)}>
              {t("common.next")}
            </Button>
          ) : (
            <Button appearance="primary" onClick={onClose}>
              {resolvedSubmit}
            </Button>
          )}
        </>
      }
    >
      {!nameReadOnly && (
        <div style={{ display: "flex", alignItems: "center", columnGap: 8, marginBottom: 12 }}>
          {STEP_KEYS.map((key, i) => (
            <span key={key} style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: step === i + 1 ? "#0078d4" : "#ccc",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
              >
                {i + 1}
              </span>
              <Body1Strong>{t(key)}</Body1Strong>
              {i < 3 && <span style={{ width: 30, height: 1, backgroundColor: "#ccc" }} />}
            </span>
          ))}
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
          <Field label={t(`${k}.schedule`)} required>
            <Input value={schedule} onChange={(_, d) => setSchedule(d.value)} />
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
        <div style={{ padding: "12px 0", color: "#666" }}>{t(`${k}.optimizationBody`)}</div>
      )}

      {step === 3 && !nameReadOnly && (
        <div style={{ padding: "12px 0", color: "#666" }}>{t(`${k}.untieBody`)}</div>
      )}

      {step === 4 && !nameReadOnly && (
        <div style={{ padding: "12px 0", color: "#666" }}>{t(`${k}.automaticBody`)}</div>
      )}

      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={(_, d) => setComments(d.value)} />
      </Field>
    </BaseDialog>
  );
}
