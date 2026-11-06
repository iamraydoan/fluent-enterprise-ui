import { useState } from "react";
import type { ServiceDetail, ServiceRecord } from "@/api";
import { BaseDialog, WizardSteps, VStack } from "@/components/common";
import { Button, Field, Input, Switch } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

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
      {!nameReadOnly && <WizardSteps steps={STEP_KEYS.map((key) => t(key))} current={step} />}

      {(step === 1 || nameReadOnly) && (
        <VStack gap={12}>
          <Field label={t(`${k}.name`)} required>
            <Input value={name} readOnly={nameReadOnly} onChange={setName} />
          </Field>
          <Field label={t(`${k}.description`)}>
            <Input value={description} onChange={setDescription} />
          </Field>
          <Field label={t(`${k}.type`)}>
            <Input value={type} onChange={setType} />
          </Field>
          <Field label={t(`${k}.dataGroup`)}>
            <Input value={dataGroup} onChange={setDataGroup} />
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
            <Switch checked={enabled} onChange={setEnabled} />
          </Field>
        </VStack>
      )}

      {step === 2 && !nameReadOnly && (
        <div style={{ padding: "12px 0", color: theme.color.textSecondary }}>
          {t(`${k}.step2Body`)}
        </div>
      )}

      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={setComments} />
      </Field>
    </BaseDialog>
  );
}
