import { useState } from "react";
import type { SendAheadRunDetail, SendAheadRunRecord } from "@/api";
import { BaseDialog } from "@/components/common";
import { Body1Strong, Button, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

interface SendAheadRunFormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  initial?: Partial<SendAheadRunDetail & SendAheadRunRecord>;
  nameReadOnly?: boolean;
  submitLabel: string;
}

const STEP_KEYS: TranslationKey[] = [
  "businessData.sendAheadRun.dialogs.form.step1",
  "businessData.sendAheadRun.dialogs.form.step2",
  "businessData.sendAheadRun.dialogs.form.step3",
  "businessData.sendAheadRun.dialogs.form.step4",
  "businessData.sendAheadRun.dialogs.form.step5",
  "businessData.sendAheadRun.dialogs.form.step6",
];

export function SendAheadRunFormDialog({
  open,
  onClose,
  title,
  initial,
  nameReadOnly,
  submitLabel,
}: SendAheadRunFormDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.sendAheadRun.dialogs.form";
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [dataGroup, setDataGroup] = useState(initial?.dataGroup ?? "");
  const [comments, setComments] = useState("");

  return (
    <BaseDialog
      open={open}
      title={title}
      onClose={onClose}
      width="min(1100px, 94vw)"
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
          {!nameReadOnly && step < 6 ? (
            <Button appearance="primary" onClick={() => setStep(step + 1)}>
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
              {i < 5 && <span style={{ width: 20, height: 1, backgroundColor: "#ccc" }} />}
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
          <Field label={t(`${k}.dataGroup`)}>
            <Input value={dataGroup} onChange={(_, d) => setDataGroup(d.value)} />
          </Field>
        </div>
      )}

      {step > 1 && !nameReadOnly && (
        <div style={{ padding: "12px 0", color: "#666" }}>
          {t("businessData.sendAheadRun.dialogs.form.stepBody", {
            step: t(STEP_KEYS[step - 1]),
          })}
        </div>
      )}

      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={(_, d) => setComments(d.value)} />
      </Field>
    </BaseDialog>
  );
}
