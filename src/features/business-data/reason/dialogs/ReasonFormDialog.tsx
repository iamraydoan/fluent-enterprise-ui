import { useState } from "react";
import type { ReasonDetail, ReasonType } from "@/api";
import { BaseDialog, WizardSteps, VStack  } from "@/components/common";
import { Button, Checkbox, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface ReasonFormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  initial?: Partial<ReasonDetail>;
  nameReadOnly?: boolean;
  submitLabel: string;
}

const REASON_TYPES: ReasonType[] = ["Bonus", "Defect", "Hold", "Loss", "Off Flow", "Pause"];

export function ReasonFormDialog({
  open,
  onClose,
  title,
  initial,
  nameReadOnly,
  submitLabel,
}: ReasonFormDialogProps) {
  const { t } = useAppTranslation();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [type, setType] = useState<ReasonType>(initial?.type ?? "Loss");
  const [excludeFromStepYield, setExcludeFromStepYield] = useState(
    initial?.excludeFromStepYield ?? false,
  );
  const [excludeFromResourceYield, setExcludeFromResourceYield] = useState(
    initial?.excludeFromResourceYield ?? false,
  );
  const [category, setCategory] = useState("");
  const [comments, setComments] = useState("");

  const k = "businessData.reason.dialogs.form";
  const isLossOrBonus = type === "Loss" || type === "Bonus";

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
          {step === 2 && (
            <Button variant="secondary" onClick={() => setStep(1)}>
              {t("common.back")}
            </Button>
          )}
          {step === 1 ? (
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
      <WizardSteps steps={[t(`${k}.generalData`), t(`${k}.information`)]} current={step} />

      {step === 1 && (
        <VStack gap={12}>
          <Field label={t(`${k}.name`)} required>
            <Input value={name} readOnly={nameReadOnly} onChange={setName} />
          </Field>
          <Field label={t(`${k}.description`)}>
            <Input value={description} onChange={setDescription} />
          </Field>
        </VStack>
      )}

      {step === 2 && (
        <VStack gap={12}>
          <Field label={t(`${k}.type`)} required>
            <select value={type} onChange={(e) => setType(e.target.value as ReasonType)}>
              {REASON_TYPES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          {isLossOrBonus && (
            <>
              <Field label={t(`${k}.excludeFromStepYield`)}>
                <Checkbox checked={excludeFromStepYield} onChange={setExcludeFromStepYield} />
              </Field>
              <Field label={t(`${k}.excludeFromResourceYield`)}>
                <Checkbox
                  checked={excludeFromResourceYield}
                  onChange={setExcludeFromResourceYield}
                />
              </Field>
            </>
          )}
          <Field label={t(`${k}.category`)}>
            <Input value={category} onChange={setCategory} />
          </Field>
        </VStack>
      )}

      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={setComments} />
      </Field>
    </BaseDialog>
  );
}
