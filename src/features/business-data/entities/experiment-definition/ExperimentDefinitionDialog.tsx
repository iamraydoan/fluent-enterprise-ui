import { useState } from "react";
import { Button, Checkbox, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { MODE_CREATE, MODE_EDIT } from "./wizardMode";
import type { WizardMode } from "./wizardMode";

const tk = (key: string) => key as TranslationKey;

const L = {
  createTitle: tk("businessData.experimentDefinition.dialog.createTitle"),
  editTitle: tk("businessData.experimentDefinition.dialog.editTitle"),
  cloneTitle: tk("businessData.experimentDefinition.dialog.cloneTitle"),
  step1: tk("businessData.experimentDefinition.dialog.step1"),
  step2: tk("businessData.experimentDefinition.dialog.step2"),
  step3: tk("businessData.experimentDefinition.dialog.step3"),
  step4: tk("businessData.experimentDefinition.dialog.step4"),
  step5: tk("businessData.experimentDefinition.dialog.step5"),
  changeSet: tk("businessData.experimentDefinition.dialog.changeSet"),
  useAutomaticChangeSet: tk("businessData.experimentDefinition.dialog.useAutomaticChangeSet"),
  approvalRole: tk("businessData.experimentDefinition.dialog.approvalRole"),
  makeEffectiveOnApproval: tk("businessData.experimentDefinition.dialog.makeEffectiveOnApproval"),
  name: tk("businessData.experimentDefinition.dialog.name"),
  description: tk("businessData.experimentDefinition.dialog.description"),
  type: tk("businessData.experimentDefinition.dialog.type"),
  ownerRole: tk("businessData.experimentDefinition.dialog.ownerRole"),
  purpose: tk("businessData.experimentDefinition.dialog.purpose"),
  note: tk("businessData.experimentDefinition.dialog.note"),
  applicableTo: tk("businessData.experimentDefinition.dialog.applicableTo"),
  applicableProduct: tk("businessData.experimentDefinition.dialog.applicableProduct"),
  applicableProductGroup: tk("businessData.experimentDefinition.dialog.applicableProductGroup"),
  product: tk("businessData.experimentDefinition.dialog.product"),
  productGroup: tk("businessData.experimentDefinition.dialog.productGroup"),
  flow: tk("businessData.experimentDefinition.dialog.flow"),
  maxMaterials: tk("businessData.experimentDefinition.dialog.maxMaterials"),
  requiredMaterialType: tk("businessData.experimentDefinition.dialog.requiredMaterialType"),
  requiredMaterialForm: tk("businessData.experimentDefinition.dialog.requiredMaterialForm"),
  mode: tk("businessData.experimentDefinition.dialog.mode"),
  modeSubMaterials: tk("businessData.experimentDefinition.dialog.modeSubMaterials"),
  modeFullMaterial: tk("businessData.experimentDefinition.dialog.modeFullMaterial"),
  plannedStartDate: tk("businessData.experimentDefinition.dialog.plannedStartDate"),
  plannedEndDate: tk("businessData.experimentDefinition.dialog.plannedEndDate"),
  objectives: tk("businessData.experimentDefinition.dialog.objectives"),
  addObjective: tk("businessData.experimentDefinition.dialog.addObjective"),
  objectiveName: tk("businessData.experimentDefinition.dialog.objectiveName"),
  objectiveTarget: tk("businessData.experimentDefinition.dialog.objectiveTarget"),
  remove: tk("businessData.experimentDefinition.dialog.remove"),
  back: tk("businessData.experimentDefinition.dialog.back"),
  next: tk("businessData.experimentDefinition.dialog.next"),
  cancel: tk("businessData.experimentDefinition.dialog.cancel"),
  create: tk("businessData.experimentDefinition.dialog.create"),
  save: tk("businessData.experimentDefinition.dialog.save"),
  clone: tk("businessData.experimentDefinition.dialog.clone"),
};

const useDialogStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  surface: {
    width: "720px",
    maxWidth: "95vw",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
  },
  head: {
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
  },
  steps: {
    display: "flex",
    gap: "12px",
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexWrap: "wrap",
  },
  step: { fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3 },
  stepActive: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
  },
  body: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflowY: "auto",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  field: { display: "grid", gridTemplateColumns: "180px 1fr", gap: "12px", alignItems: "center" },
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
  const shared = useSharedStyles();
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
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>{t(title)}</div>
        <div className={styles.steps}>
          {stepLabels.map((s, i) => (
            <span key={i} className={step === i + 1 ? styles.stepActive : styles.step}>
              {t(s)}
            </span>
          ))}
        </div>
        <div className={styles.body}>
          {step === 1 && (
            <>
              <div className={styles.field}>
                <label>{t(L.changeSet)}</label>
                <Input
                  value={changeSet}
                  onChange={(_, d) => setChangeSet(d.value)}
                  disabled={useAutoCs}
                />
              </div>
              <div className={styles.field}>
                <span />
                <Checkbox
                  label={t(L.useAutomaticChangeSet)}
                  checked={useAutoCs === true}
                  onChange={(_, d) => setUseAutoCs(d.checked === true)}
                />
              </div>
              <div className={styles.field}>
                <label>{t(L.approvalRole)}</label>
                <Input value={approvalRole} onChange={(_, d) => setApprovalRole(d.value)} />
              </div>
              <div className={styles.field}>
                <span />
                <Checkbox
                  label={t(L.makeEffectiveOnApproval)}
                  checked={effectiveOnApproval === true}
                  onChange={(_, d) => setEffectiveOnApproval(d.checked === true)}
                />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className={styles.field}>
                <label>
                  <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
                  {t(L.name)}
                </label>
                <Input
                  value={name}
                  onChange={(_, d) => setName(d.value)}
                  disabled={mode === MODE_EDIT}
                />
              </div>
              <div className={styles.field}>
                <label>{t(L.description)}</label>
                <Textarea value={description} onChange={(_, d) => setDescription(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.type)}</label>
                <Input value={type} onChange={(_, d) => setType(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.ownerRole)}</label>
                <Input value={ownerRole} onChange={(_, d) => setOwnerRole(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.purpose)}</label>
                <Textarea value={purpose} onChange={(_, d) => setPurpose(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.note)}</label>
                <Textarea value={note} onChange={(_, d) => setNote(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.applicableTo)}</label>
                <select
                  className={styles.select}
                  value={applicableTo}
                  onChange={(e) => setApplicableTo(e.target.value)}
                >
                  <option value="Product">{t(L.applicableProduct)}</option>
                  <option value="ProductGroup">{t(L.applicableProductGroup)}</option>
                </select>
              </div>
              {applicableTo === "Product" ? (
                <div className={styles.field}>
                  <label>{t(L.product)}</label>
                  <Input value={product} onChange={(_, d) => setProduct(d.value)} />
                </div>
              ) : (
                <div className={styles.field}>
                  <label>{t(L.productGroup)}</label>
                  <Input value={productGroup} onChange={(_, d) => setProductGroup(d.value)} />
                </div>
              )}
              <div className={styles.field}>
                <label>{t(L.flow)}</label>
                <Input value={flow} onChange={(_, d) => setFlow(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.maxMaterials)}</label>
                <Input value={maxMaterials} onChange={(_, d) => setMaxMaterials(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.requiredMaterialType)}</label>
                <Input value={materialType} onChange={(_, d) => setMaterialType(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.requiredMaterialForm)}</label>
                <Input value={materialForm} onChange={(_, d) => setMaterialForm(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.mode)}</label>
                <select
                  className={styles.select}
                  value={expMode}
                  onChange={(e) => setExpMode(e.target.value)}
                >
                  <option value="SubMaterials">{t(L.modeSubMaterials)}</option>
                  <option value="FullMaterial">{t(L.modeFullMaterial)}</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>{t(L.plannedStartDate)}</label>
                <Input value="" onChange={() => undefined} />
              </div>
              <div className={styles.field}>
                <label>{t(L.plannedEndDate)}</label>
                <Input value="" onChange={() => undefined} />
              </div>
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
                      setObjectives(
                        objectives.map((x, j) => (j === i ? { ...x, name: d.value } : x)),
                      )
                    }
                  />
                  <Input
                    placeholder={t(L.objectiveTarget)}
                    value={o.target}
                    onChange={(_, d) =>
                      setObjectives(
                        objectives.map((x, j) => (j === i ? { ...x, target: d.value } : x)),
                      )
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
        </div>
        <div className={styles.footer}>
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
        </div>
      </div>
    </div>
  );
}
