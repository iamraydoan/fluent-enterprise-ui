import { useState } from "react";
import type { ReasonDetail, ReasonType } from "@/api";
import { BaseDialog, WizardSteps } from "@/components/common";
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
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          {step === 2 && (
            <Button appearance="secondary" onClick={() => setStep(1)}>
              {t("common.back")}
            </Button>
          )}
          {step === 1 ? (
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
      <WizardSteps steps={[t(`${k}.generalData`), t(`${k}.information`)]} current={step} />

      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
          <Field label={t(`${k}.name`)} required>
            <Input value={name} readOnly={nameReadOnly} onChange={(_, d) => setName(d.value)} />
          </Field>
          <Field label={t(`${k}.description`)}>
            <Input value={description} onChange={(_, d) => setDescription(d.value)} />
          </Field>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
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
                <Checkbox
                  checked={excludeFromStepYield}
                  onChange={(_, d) => setExcludeFromStepYield(d.checked === true)}
                />
              </Field>
              <Field label={t(`${k}.excludeFromResourceYield`)}>
                <Checkbox
                  checked={excludeFromResourceYield}
                  onChange={(_, d) => setExcludeFromResourceYield(d.checked === true)}
                />
              </Field>
            </>
          )}
          <Field label={t(`${k}.category`)}>
            <Input value={category} onChange={(_, d) => setCategory(d.value)} />
          </Field>
        </div>
      )}

      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={(_, d) => setComments(d.value)} />
      </Field>
    </BaseDialog>
  );
}
