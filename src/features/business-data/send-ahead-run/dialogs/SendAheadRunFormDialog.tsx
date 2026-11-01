import { useState } from "react";
import type { SendAheadRunDetail, SendAheadRunRecord } from "@/api";
import { BaseDialog, WizardSteps } from "@/components/common";
import { Button, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

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
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          {!nameReadOnly && step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              {t("common.back")}
            </Button>
          )}
          {!nameReadOnly && step < 6 ? (
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
          <Field label={t(`${k}.dataGroup`)}>
            <Input value={dataGroup} onChange={setDataGroup} />
          </Field>
        </div>
      )}

      {step > 1 && !nameReadOnly && (
        <div style={{ padding: `${theme.spacing.md} 0`, color: theme.color.textTertiary }}>
          {t("businessData.sendAheadRun.dialogs.form.stepBody", {
            step: t(STEP_KEYS[step - 1]),
          })}
        </div>
      )}

      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={setComments} />
      </Field>
    </BaseDialog>
  );
}
