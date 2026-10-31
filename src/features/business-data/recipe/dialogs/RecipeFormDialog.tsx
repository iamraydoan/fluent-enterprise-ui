import { useState } from "react";
import type { RecipeDetail, RecipeRecord } from "@/api";
import { BaseDialog } from "@/components/common";
import { Body1Strong, Button, Checkbox, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

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
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          {stepCount === 2 && step === 2 && (
            <Button appearance="secondary" onClick={() => setStep(1)}>
              {t("common.back")}
            </Button>
          )}
          {stepCount === 2 && step === 1 ? (
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
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: step === 1 ? "#0078d4" : "#ccc",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
            }}
          >
            1
          </span>
          <Body1Strong>{t(`${k}.changeSet`)}</Body1Strong>
          <span style={{ width: 40, height: 1, backgroundColor: "#ccc" }} />
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: step === 2 ? "#0078d4" : "#ccc",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
            }}
          >
            2
          </span>
          <Body1Strong>{t(`${k}.generalData`)}</Body1Strong>
        </div>
      )}

      {step === 1 && !nameReadOnly && (
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

      {(step === 2 || nameReadOnly) && (
        <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
          <Field label={t(`${k}.name`)} required>
            <Input value={name} readOnly={nameReadOnly} onChange={(_, d) => setName(d.value)} />
          </Field>
          {!nameReadOnly && (
            <Field label={t(`${k}.revision`)}>
              <Input value={revision} onChange={(_, d) => setRevision(d.value)} />
            </Field>
          )}
          <Field label={t(`${k}.description`)}>
            <Input value={description} onChange={(_, d) => setDescription(d.value)} />
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
            <Checkbox checked={isEnabled} onChange={(_, d) => setIsEnabled(d.checked === true)} />
          </Field>
          <Field label={t(`${k}.isExecutable`)}>
            <Checkbox
              checked={isExecutable}
              onChange={(_, d) => setIsExecutable(d.checked === true)}
            />
          </Field>
          <Field label={t(`${k}.resourceRecipeName`)} required>
            <Input value={resourceRecipeName} onChange={(_, d) => setResourceRecipeName(d.value)} />
          </Field>
          <Field label={t(`${k}.userInformation`)}>
            <Input value={userInformation} onChange={(_, d) => setUserInformation(d.value)} />
          </Field>
          <Field label={t(`${k}.supplierInformation`)}>
            <Input
              value={supplierInformation}
              onChange={(_, d) => setSupplierInformation(d.value)}
            />
          </Field>
        </div>
      )}

      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={(_, d) => setComments(d.value)} />
      </Field>
    </BaseDialog>
  );
}
