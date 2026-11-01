import { useState } from "react";
import { BaseDialog, HStack, VStack, WizardSteps } from "@/components/common";
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
              {t(`${k}.confirm`)}
            </Button>
          )}
        </>
      }
    >
            <WizardSteps steps={[t(`${k}.changeSet`), t(`${k}.details`)]} current={step} />

      {step === 1 && (
        <VStack gap={12}>
          <Field label={t(`${k}.changeSet`)}>
            <HStack gap={8}>
              <Input value={changeSet} onChange={setChangeSet} />
              <Button variant="secondary" onClick={() => {}}>
                {t(`${k}.createNew`)}
              </Button>
            </HStack>
          </Field>
          <Field label={t(`${k}.approverRole`)}>
            <Input value={approverRole} onChange={setApproverRole} />
          </Field>
          <Field label={t(`${k}.useAutomaticChangeSet`)}>
            <Checkbox
              checked={automaticChangeSet}
              onChange={setAutomaticChangeSet}
            />
          </Field>
        </VStack>
      )}

      {step === 2 && (
        <div style={{ padding: "12px 0" }}>{t(`${k}.message`, { name: recipeName })}</div>
      )}
    </BaseDialog>
  );
}
