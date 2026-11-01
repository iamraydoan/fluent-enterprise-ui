import { useState } from "react";
import type { RecipeDetail, RecipeRecord } from "@/api";
import { BaseDialog, HStack, VStack, WizardSteps } from "@/components/common";
import { Button, Checkbox, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

interface RecipeFormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  initial?: Partial<RecipeDetail & RecipeRecord>;
  nameReadOnly?: boolean;
  submitLabel: string;
}

const RECIPE_TYPES = ["Standard", "Template"];

export function RecipeFormDialog({
  open,
  onClose,
  title,
  initial,
  nameReadOnly,
  submitLabel,
}: RecipeFormDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.recipe.dialogs.form";
  const [step, setStep] = useState(1);
  const [changeSet, setChangeSet] = useState("");
  const [approverRole, setApproverRole] = useState("");
  const [automaticChangeSet, setAutomaticChangeSet] = useState(false);
  const [name, setName] = useState(initial?.name ?? "");
  const [revision, setRevision] = useState(initial?.revision ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [type, setType] = useState(initial?.type ?? "Standard");
  const [isEnabled, setIsEnabled] = useState(initial?.isEnabled ?? true);
  const [isExecutable, setIsExecutable] = useState(initial?.isExecutable ?? true);
  const [resourceRecipeName, setResourceRecipeName] = useState("");
  const [userInformation, setUserInformation] = useState("");
  const [supplierInformation, setSupplierInformation] = useState("");
  const [comments, setComments] = useState("");

  const stepCount = nameReadOnly ? 1 : 2;

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
          {stepCount === 2 && step === 2 && (
            <Button variant="secondary" onClick={() => setStep(1)}>
              {t("common.back")}
            </Button>
          )}
          {stepCount === 2 && step === 1 ? (
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
      {!nameReadOnly && (
        <WizardSteps steps={[t(`${k}.changeSet`), t(`${k}.generalData`)]} current={step} />
      )}

      {step === 1 && !nameReadOnly && (
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

      {(step === 2 || nameReadOnly) && (
        <VStack gap={12}>
          <Field label={t(`${k}.name`)} required>
            <Input value={name} readOnly={nameReadOnly} onChange={setName} />
          </Field>
          {!nameReadOnly && (
            <Field label={t(`${k}.revision`)}>
              <Input value={revision} onChange={setRevision} />
            </Field>
          )}
          <Field label={t(`${k}.description`)}>
            <Input value={description} onChange={setDescription} />
          </Field>
          <Field label={t(`${k}.type`)} required>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {RECIPE_TYPES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t(`${k}.isEnabled`)}>
            <Checkbox checked={isEnabled} onChange={setIsEnabled} />
          </Field>
          <Field label={t(`${k}.isExecutable`)}>
            <Checkbox
              checked={isExecutable}
              onChange={setIsExecutable}
            />
          </Field>
          <Field label={t(`${k}.resourceRecipeName`)} required>
            <Input value={resourceRecipeName} onChange={setResourceRecipeName} />
          </Field>
          <Field label={t(`${k}.userInformation`)}>
            <Input value={userInformation} onChange={setUserInformation} />
          </Field>
          <Field label={t(`${k}.supplierInformation`)}>
            <Input
              value={supplierInformation}
              onChange={setSupplierInformation}
            />
          </Field>
        </VStack>
      )}

      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={setComments} />
      </Field>
    </BaseDialog>
  );
}
