import { useState } from "react";
import { BaseDialog, FormField } from "@/components/common";
import { Button, Checkbox, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { MODE_CREATE, MODE_EDIT } from "../components/wizardMode";
import type { WizardMode } from "../components/wizardMode";

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
    display: "flex",
    gap: "12px",
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexWrap: "wrap",
    margin: "-16px -20px 0",
  },
  step: { fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3 },
  stepActive: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
  },
  select: {
    padding: "6px 8px",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase300,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  row: { display: "flex", gap: "8px", alignItems: "center" },
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
              appearance="primary"
              onClick={() => setStep(step + 1)}
              disabled={step === 2 && !canSubmit}
            >
              {t(L.next)}
            </Button>
          ) : (
            <Button appearance="primary" onClick={onClose}>
              {t(mode === MODE_CREATE ? L.create : mode === MODE_EDIT ? L.save : L.clone)}
            </Button>
          )}
        </>
      }
    >
      <div className={styles.steps}>
        {stepLabels.map((s, i) => (
          <span key={i} className={step === i + 1 ? styles.stepActive : styles.step}>
            {t(s)}
          </span>
        ))}
      </div>
      {step === 1 && (
        <>
          <FormField label={<>{t(L.changeSet)}</>}>
            <Input
              value={changeSet}
              onChange={(_, d) => setChangeSet(d.value)}
              disabled={useAutoCs}
            />
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
              onChange={(_, d) => setUseAutoCs(d.checked === true)}
            />
          </FormField>
          <FormField label={<>{t(L.approvalRole)}</>}>
            <Input value={approvalRole} onChange={(_, d) => setApprovalRole(d.value)} />
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
              onChange={(_, d) => setEffectiveOnApproval(d.checked === true)}
            />
          </FormField>
        </>
      )}
      {step === 2 && (
        <>
          <FormField
            label={
              <>
                <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
                {t(L.name)}
              </>
            }
          >
            <Input
              value={name}
              onChange={(_, d) => setName(d.value)}
              disabled={mode === MODE_EDIT}
            />
          </FormField>
          <FormField label={<>{t(L.description)}</>}>
            <Textarea value={description} onChange={(_, d) => setDescription(d.value)} />
          </FormField>
          <FormField label={<>{t(L.type)}</>}>
            <Input value={type} onChange={(_, d) => setType(d.value)} />
          </FormField>
          <FormField label={<>{t(L.ownerRole)}</>}>
            <Input value={ownerRole} onChange={(_, d) => setOwnerRole(d.value)} />
          </FormField>
          <FormField label={<>{t(L.purpose)}</>}>
            <Textarea value={purpose} onChange={(_, d) => setPurpose(d.value)} />
          </FormField>
          <FormField label={<>{t(L.note)}</>}>
            <Textarea value={note} onChange={(_, d) => setNote(d.value)} />
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
              <Input value={product} onChange={(_, d) => setProduct(d.value)} />
            </FormField>
          ) : (
            <FormField label={<>{t(L.productGroup)}</>}>
              <Input value={productGroup} onChange={(_, d) => setProductGroup(d.value)} />
            </FormField>
          )}
          <FormField label={<>{t(L.flow)}</>}>
            <Input value={flow} onChange={(_, d) => setFlow(d.value)} />
          </FormField>
          <FormField label={<>{t(L.maxMaterials)}</>}>
            <Input value={maxMaterials} onChange={(_, d) => setMaxMaterials(d.value)} />
          </FormField>
          <FormField label={<>{t(L.requiredMaterialType)}</>}>
            <Input value={materialType} onChange={(_, d) => setMaterialType(d.value)} />
          </FormField>
          <FormField label={<>{t(L.requiredMaterialForm)}</>}>
            <Input value={materialForm} onChange={(_, d) => setMaterialForm(d.value)} />
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
          <div className={styles.row}>
            <Button
              size="small"
              onClick={() => setObjectives([...objectives, { name: "", target: "" }])}
            >
              + {t(L.addObjective)}
            </Button>
          </div>
          {objectives.map((o, i) => (
            <div key={i} className={styles.row}>
              <Input
                placeholder={t(L.objectiveName)}
                value={o.name}
                onChange={(_, d) =>
                  setObjectives(objectives.map((x, j) => (j === i ? { ...x, name: d.value } : x)))
                }
              />
              <Input
                placeholder={t(L.objectiveTarget)}
                value={o.target}
                onChange={(_, d) =>
                  setObjectives(objectives.map((x, j) => (j === i ? { ...x, target: d.value } : x)))
                }
              />
              <Button
                size="small"
                onClick={() => setObjectives(objectives.filter((_, j) => j !== i))}
              >
                {t(L.remove)}
              </Button>
            </div>
          ))}
        </>
      )}
      {(step === 4 || step === 5) && (
        <div className={styles.row}>
          <span>{t(step === 4 ? L.step4 : L.step5)}</span>
        </div>
      )}
    </BaseDialog>
  );
}
