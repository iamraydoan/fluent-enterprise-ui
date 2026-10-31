import { useState } from "react";
import { BaseDialog, WizardSteps } from "@/components/common";
import { Button, Checkbox, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface UnterminateRecipeDialogProps {
  open: boolean;
  onClose: () => void;
  recipeName: string;
}

export function UnterminateRecipeDialog({
  open,
  onClose,
  recipeName,
}: UnterminateRecipeDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.recipe.dialogs.unterminate";
  const [step, setStep] = useState(1);
  const [changeSet, setChangeSet] = useState("");
  const [approverRole, setApproverRole] = useState("");
  const [automaticChangeSet, setAutomaticChangeSet] = useState(false);

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(800px, 88vw)"
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
              {t(`${k}.confirm`)}
            </Button>
          )}
        </>
      }
    >
            <WizardSteps steps={[t(`${k}.changeSet`), t(`${k}.details`)]} current={step} />

      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
          <Field label={t(`${k}.changeSet`)}>
            <div style={{ display: "flex", columnGap: 8 }}>
              <Input value={changeSet} onChange={(_, d) => setChangeSet(d.value)} />
              <Button appearance="secondary" onClick={() => {}}>
                {t(`${k}.createNew`)}
              </Button>
            </div>
          </Field>
          <Field label={t(`${k}.approverRole`)}>
            <Input value={approverRole} onChange={(_, d) => setApproverRole(d.value)} />
          </Field>
          <Field label={t(`${k}.useAutomaticChangeSet`)}>
            <Checkbox
              checked={automaticChangeSet}
              onChange={(_, d) => setAutomaticChangeSet(d.checked === true)}
            />
          </Field>
        </div>
      )}

      {step === 2 && (
        <div style={{ padding: "12px 0" }}>{t(`${k}.message`, { name: recipeName })}</div>
      )}
    </BaseDialog>
  );
}
