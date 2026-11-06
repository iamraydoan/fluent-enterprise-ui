import { useState } from "react";
import { BaseDialog, FormField, HStack } from "@/components/common";
import { Button, Checkbox, Input, Textarea, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";
import { MODE_CREATE, MODE_EDIT } from "../../components/wizardMode";
import type { WizardMode } from "../../components/wizardMode";

const L: Record<string, TranslationKey> = {
  createTitle: "businessData.experimentDefinition.dialog.createTitle",
  editTitle: "businessData.experimentDefinition.dialog.editTitle",
  cloneTitle: "businessData.experimentDefinition.dialog.cloneTitle",
  step1: "businessData.experimentDefinition.dialog.step1",
  step2: "businessData.experimentDefinition.dialog.step2",
  step3: "businessData.experimentDefinition.dialog.step3",
  step4: "businessData.experimentDefinition.dialog.step4",
  step5: "businessData.experimentDefinition.dialog.step5",
  changeSet: "businessData.experimentDefinition.dialog.changeSet",
  useAutomaticChangeSet: "businessData.experimentDefinition.dialog.useAutomaticChangeSet",
  approvalRole: "businessData.experimentDefinition.dialog.approvalRole",
  makeEffectiveOnApproval: "businessData.experimentDefinition.dialog.makeEffectiveOnApproval",
  name: "businessData.experimentDefinition.dialog.name",
  description: "businessData.experimentDefinition.dialog.description",
  type: "businessData.experimentDefinition.dialog.type",
  ownerRole: "businessData.experimentDefinition.dialog.ownerRole",
  purpose: "businessData.experimentDefinition.dialog.purpose",
  note: "businessData.experimentDefinition.dialog.note",
  applicableTo: "businessData.experimentDefinition.dialog.applicableTo",
  applicableProduct: "businessData.experimentDefinition.dialog.applicableProduct",
  applicableProductGroup: "businessData.experimentDefinition.dialog.applicableProductGroup",
  product: "businessData.experimentDefinition.dialog.product",
  productGroup: "businessData.experimentDefinition.dialog.productGroup",
  flow: "businessData.experimentDefinition.dialog.flow",
  maxMaterials: "businessData.experimentDefinition.dialog.maxMaterials",
  requiredMaterialType: "businessData.experimentDefinition.dialog.requiredMaterialType",
  requiredMaterialForm: "businessData.experimentDefinition.dialog.requiredMaterialForm",
  mode: "businessData.experimentDefinition.dialog.mode",
  modeSubMaterials: "businessData.experimentDefinition.dialog.modeSubMaterials",
  modeFullMaterial: "businessData.experimentDefinition.dialog.modeFullMaterial",
  plannedStartDate: "businessData.experimentDefinition.dialog.plannedStartDate",
  plannedEndDate: "businessData.experimentDefinition.dialog.plannedEndDate",
  objectives: "businessData.experimentDefinition.dialog.objectives",
  addObjective: "businessData.experimentDefinition.dialog.addObjective",
  objectiveName: "businessData.experimentDefinition.dialog.objectiveName",
  objectiveTarget: "businessData.experimentDefinition.dialog.objectiveTarget",
  remove: "businessData.experimentDefinition.dialog.remove",
  back: "businessData.experimentDefinition.dialog.back",
  next: "businessData.experimentDefinition.dialog.next",
  cancel: "businessData.experimentDefinition.dialog.cancel",
  create: "businessData.experimentDefinition.dialog.create",
  save: "businessData.experimentDefinition.dialog.save",
  clone: "businessData.experimentDefinition.dialog.clone",
};

const useDialogStyles = makeStyles({
  steps: {
    padding: "12px 16px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    margin: "-16px -20px 0",
  },
  step: { fontSize: theme.font.sizeSm, color: theme.color.textTertiary },
  stepActive: {
    fontSize: theme.font.sizeSm,
    fontWeight: theme.font.weightSemibold,
    color: theme.color.textBrand,
  },
  select: {
    padding: `6px ${theme.spacing.sm}`,
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.md,
    fontSize: theme.font.sizeMd,
    backgroundColor: theme.color.surface,
  },
});

interface DialogProps {
  mode: WizardMode;
  initialName?: string;
  onClose: () => void;
}

export function ExperimentDefinitionDialog({ mode, initialName, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [step, setStep] = useState(1);
  const [changeSet, setChangeSet] = useState("");
  const [useAutoCs, setUseAutoCs] = useState(false);
  const [approvalRole, setApprovalRole] = useState("");
  const [effectiveOnApproval, setEffectiveOnApproval] = useState(false);
  const [name, setName] = useState(initialName ?? "");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [ownerRole, setOwnerRole] = useState("");
  const [purpose, setPurpose] = useState("");
  const [note, setNote] = useState("");
  const [applicableTo, setApplicableTo] = useState("Product");
  const [product, setProduct] = useState("");
  const [productGroup, setProductGroup] = useState("");
  const [flow, setFlow] = useState("");
  const [maxMaterials, setMaxMaterials] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [materialForm, setMaterialForm] = useState("");
  const [expMode, setExpMode] = useState("FullMaterial");
  const [objectives, setObjectives] = useState<{ name: string; target: string }[]>([]);

  const title =
    mode === MODE_CREATE ? L.createTitle : mode === MODE_EDIT ? L.editTitle : L.cloneTitle;
  const canSubmit = name.trim().length > 0;
  const stepLabels = [L.step1, L.step2, L.step3, L.step4, L.step5];

  return (
    <BaseDialog
      open
      title={t(title)}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          {step > 1 && <Button onClick={() => setStep(step - 1)}>{t(L.back)}</Button>}
          {step < 5 ? (
            <Button
              variant="primary"
              onClick={() => setStep(step + 1)}
              disabled={step === 2 && !canSubmit}
            >
              {t(L.next)}
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose}>
              {t(mode === MODE_CREATE ? L.create : mode === MODE_EDIT ? L.save : L.clone)}
            </Button>
          )}
        </>
      }
    >
      <HStack gap="12px" wrap className={styles.steps}>
        {stepLabels.map((s, i) => (
          <span key={i} className={step === i + 1 ? styles.stepActive : styles.step}>
            {t(s)}
          </span>
        ))}
      </HStack>
      {step === 1 && (
        <>
          <FormField label={<>{t(L.changeSet)}</>}>
            <Input value={changeSet} onChange={setChangeSet} disabled={useAutoCs} />
          </FormField>
          <FormField
            label={
              <>
                <span />
              </>
            }
          >
            <Checkbox
              label={t(L.useAutomaticChangeSet)}
              checked={useAutoCs === true}
              onChange={setUseAutoCs}
            />
          </FormField>
          <FormField label={<>{t(L.approvalRole)}</>}>
            <Input value={approvalRole} onChange={setApprovalRole} />
          </FormField>
          <FormField
            label={
              <>
                <span />
              </>
            }
          >
            <Checkbox
              label={t(L.makeEffectiveOnApproval)}
              checked={effectiveOnApproval === true}
              onChange={setEffectiveOnApproval}
            />
          </FormField>
        </>
      )}
      {step === 2 && (
        <>
          <FormField
            label={
              <>
                <span style={{ color: theme.color.textDanger }}>* </span>
                {t(L.name)}
              </>
            }
          >
            <Input value={name} onChange={setName} disabled={mode === MODE_EDIT} />
          </FormField>
          <FormField label={<>{t(L.description)}</>}>
            <Textarea value={description} onChange={setDescription} />
          </FormField>
          <FormField label={<>{t(L.type)}</>}>
            <Input value={type} onChange={setType} />
          </FormField>
          <FormField label={<>{t(L.ownerRole)}</>}>
            <Input value={ownerRole} onChange={setOwnerRole} />
          </FormField>
          <FormField label={<>{t(L.purpose)}</>}>
            <Textarea value={purpose} onChange={setPurpose} />
          </FormField>
          <FormField label={<>{t(L.note)}</>}>
            <Textarea value={note} onChange={setNote} />
          </FormField>
          <FormField label={<>{t(L.applicableTo)}</>}>
            <select
              className={styles.select}
              value={applicableTo}
              onChange={(e) => setApplicableTo(e.target.value)}
            >
              <option value="Product">{t(L.applicableProduct)}</option>
              <option value="ProductGroup">{t(L.applicableProductGroup)}</option>
            </select>
          </FormField>
          {applicableTo === "Product" ? (
            <FormField label={<>{t(L.product)}</>}>
              <Input value={product} onChange={setProduct} />
            </FormField>
          ) : (
            <FormField label={<>{t(L.productGroup)}</>}>
              <Input value={productGroup} onChange={setProductGroup} />
            </FormField>
          )}
          <FormField label={<>{t(L.flow)}</>}>
            <Input value={flow} onChange={setFlow} />
          </FormField>
          <FormField label={<>{t(L.maxMaterials)}</>}>
            <Input value={maxMaterials} onChange={setMaxMaterials} />
          </FormField>
          <FormField label={<>{t(L.requiredMaterialType)}</>}>
            <Input value={materialType} onChange={setMaterialType} />
          </FormField>
          <FormField label={<>{t(L.requiredMaterialForm)}</>}>
            <Input value={materialForm} onChange={setMaterialForm} />
          </FormField>
          <FormField label={<>{t(L.mode)}</>}>
            <select
              className={styles.select}
              value={expMode}
              onChange={(e) => setExpMode(e.target.value)}
            >
              <option value="SubMaterials">{t(L.modeSubMaterials)}</option>
              <option value="FullMaterial">{t(L.modeFullMaterial)}</option>
            </select>
          </FormField>
          <FormField label={<>{t(L.plannedStartDate)}</>}>
            <Input value="" onChange={() => undefined} />
          </FormField>
          <FormField label={<>{t(L.plannedEndDate)}</>}>
            <Input value="" onChange={() => undefined} />
          </FormField>
        </>
      )}
      {step === 3 && (
        <>
          <HStack gap="8px" align="center">
            <Button
              size="sm"
              onClick={() => setObjectives([...objectives, { name: "", target: "" }])}
            >
              + {t(L.addObjective)}
            </Button>
          </HStack>
          {objectives.map((o, i) => (
            <HStack gap="8px" align="center" key={i}>
              <Input
                placeholder={t(L.objectiveName)}
                value={o.name}
                onChange={(value) =>
                  setObjectives(objectives.map((x, j) => (j === i ? { ...x, name: value } : x)))
                }
              />
              <Input
                placeholder={t(L.objectiveTarget)}
                value={o.target}
                onChange={(value) =>
                  setObjectives(objectives.map((x, j) => (j === i ? { ...x, target: value } : x)))
                }
              />
              <Button size="sm" onClick={() => setObjectives(objectives.filter((_, j) => j !== i))}>
                {t(L.remove)}
              </Button>
            </HStack>
          ))}
        </>
      )}
      {(step === 4 || step === 5) && (
        <HStack gap="8px" align="center">
          <span>{t(step === 4 ? L.step4 : L.step5)}</span>
        </HStack>
      )}
    </BaseDialog>
  );
}
