import { useState } from "react";
import type { ServiceDetail, ServiceRecord } from "@/api";
import { BaseDialog } from "@/components/common";
import { Body1Strong, Button, Field, Input, Switch } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

interface ServiceFormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  initial?: Partial<ServiceDetail & ServiceRecord>;
  nameReadOnly?: boolean;
  submitLabel: string;
}

const PROCESSING_TYPES = ["Consumable Feed", "Process", "Storage", "Transport"];

const STEP_KEYS: TranslationKey[] = [
  "businessData.service.dialogs.form.step1",
  "businessData.service.dialogs.form.step2",
];

export function ServiceFormDialog({
  open,
  onClose,
  title,
  initial,
  nameReadOnly,
  submitLabel,
}: ServiceFormDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.service.dialogs.form";
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [type, setType] = useState(initial?.type ?? "Process");
  const [dataGroup, setDataGroup] = useState(initial?.dataGroup ?? "");
  const [processingType, setProcessingType] = useState(initial?.processingType ?? "Process");
  const [enabled, setEnabled] = useState(initial?.enabled ?? true);
  const [comments, setComments] = useState("");

  return (
    <BaseDialog
      open={open}
      title={title}
      onClose={onClose}
      width="min(950px, 92vw)"
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
              {i < 1 && <span style={{ width: 30, height: 1, backgroundColor: "#ccc" }} />}
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
          <Field label={t(`${k}.type`)}>
            <Input value={type} onChange={(_, d) => setType(d.value)} />
          </Field>
          <Field label={t(`${k}.dataGroup`)}>
            <Input value={dataGroup} onChange={(_, d) => setDataGroup(d.value)} />
          </Field>
          <Field label={t(`${k}.processingType`)}>
            <select value={processingType} onChange={(e) => setProcessingType(e.target.value)}>
              {PROCESSING_TYPES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t(`${k}.enabled`)}>
            <Switch checked={enabled} onChange={(_, d) => setEnabled(d.checked)} />
          </Field>
        </div>
      )}

      {step === 2 && !nameReadOnly && (
        <div style={{ padding: "12px 0", color: "#666" }}>{t(`${k}.step2Body`)}</div>
      )}

      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={(_, d) => setComments(d.value)} />
      </Field>
    </BaseDialog>
  );
}
