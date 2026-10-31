import { useState } from "react";
import { BaseDialog } from "@/components/common";
import { Button, Checkbox, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { MODE_CREATE, MODE_EDIT } from "../../components/wizardMode";
import type { WizardMode } from "../../components/wizardMode";

const L: Record<string, TranslationKey> = {
  createTitle: "businessData.inspectionPlan.dialog.createTitle",
  editTitle: "businessData.inspectionPlan.dialog.editTitle",
  cloneTitle: "businessData.inspectionPlan.dialog.cloneTitle",
  step1: "businessData.inspectionPlan.dialog.step1",
  step2: "businessData.inspectionPlan.dialog.step2",
  step3: "businessData.inspectionPlan.dialog.step3",
  changeSet: "businessData.inspectionPlan.dialog.changeSet",
  useAutomaticChangeSet: "businessData.inspectionPlan.dialog.useAutomaticChangeSet",
  approvalRole: "businessData.inspectionPlan.dialog.approvalRole",
  name: "businessData.inspectionPlan.dialog.name",
  description: "businessData.inspectionPlan.dialog.description",
  type: "businessData.inspectionPlan.dialog.type",
  resultsRequiredBeforeTrackOut: "businessData.inspectionPlan.dialog.resultsRequiredBeforeTrackOut",
  enableMultipleSamples: "businessData.inspectionPlan.dialog.enableMultipleSamples",
  containsSeparateInspectionSteps:
    "businessData.inspectionPlan.dialog.containsSeparateInspectionSteps",
  closeAutomaticallyOnPass: "businessData.inspectionPlan.dialog.closeAutomaticallyOnPass",
  closeAutomaticallyOnFail: "businessData.inspectionPlan.dialog.closeAutomaticallyOnFail",
  futureHoldCreationMode: "businessData.inspectionPlan.dialog.futureHoldCreationMode",
  futureHoldNone: "businessData.inspectionPlan.dialog.futureHoldNone",
  futureHoldAlways: "businessData.inspectionPlan.dialog.futureHoldAlways",
  futureHoldOnFail: "businessData.inspectionPlan.dialog.futureHoldOnFail",
  addStep: "businessData.inspectionPlan.dialog.addStep",
  remove: "businessData.inspectionPlan.dialog.remove",
  stepName: "businessData.inspectionPlan.dialog.stepName",
  isInProcessInspection: "businessData.inspectionPlan.dialog.isInProcessInspection",
  inspectionFlow: "businessData.inspectionPlan.dialog.inspectionFlow",
  inspectionStep: "businessData.inspectionPlan.dialog.inspectionStep",
  back: "businessData.inspectionPlan.dialog.back",
  next: "businessData.inspectionPlan.dialog.next",
  cancel: "businessData.inspectionPlan.dialog.cancel",
  create: "businessData.inspectionPlan.dialog.create",
  save: "businessData.inspectionPlan.dialog.save",
  clone: "businessData.inspectionPlan.dialog.clone",
};

const useStyles = makeStyles({
  steps: {
    display: "flex",
    gap: "16px",
    padding: "4px 4px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: "4px",
  },
  step: { fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3 },
  stepActive: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
  },
  field: { display: "grid", gridTemplateColumns: "220px 1fr", gap: "12px", alignItems: "center" },
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

export function InspectionPlanDialog({ mode, initialName, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const [step, setStep] = useState(1);
  const [changeSet, setChangeSet] = useState("");
  const [useAutoCs, setUseAutoCs] = useState(false);
  const [approvalRole, setApprovalRole] = useState("");
  const [name, setName] = useState(initialName ?? "");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [resultsRequired, setResultsRequired] = useState(false);
  const [multipleSamples, setMultipleSamples] = useState(false);
  const [separateSteps, setSeparateSteps] = useState(false);
  const [closeOnPass, setCloseOnPass] = useState(false);
  const [closeOnFail, setCloseOnFail] = useState(false);
  const [futureHoldMode, setFutureHoldMode] = useState("None");
  const [steps, setSteps] = useState<
    { name: string; inProcess: boolean; flow: string; step: string }[]
  >([]);

  const title =
    mode === MODE_CREATE ? L.createTitle : mode === MODE_EDIT ? L.editTitle : L.cloneTitle;
  const canSubmit = name.trim().length > 0;

  return (
    <BaseDialog
      open
      title={t(title)}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          {step > 1 && <Button onClick={() => setStep(step - 1)}>{t(L.back)}</Button>}
          {step < 3 ? (
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
        <span className={step === 1 ? styles.stepActive : styles.step}>{t(L.step1)}</span>
        <span className={step === 2 ? styles.stepActive : styles.step}>{t(L.step2)}</span>
        <span className={step === 3 ? styles.stepActive : styles.step}>{t(L.step3)}</span>
      </div>
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
            <label>{t(L.resultsRequiredBeforeTrackOut)}</label>
            <Checkbox
              checked={resultsRequired === true}
              onChange={(_, d) => setResultsRequired(d.checked === true)}
            />
          </div>
          <div className={styles.field}>
            <label>{t(L.enableMultipleSamples)}</label>
            <Checkbox
              checked={multipleSamples === true}
              onChange={(_, d) => setMultipleSamples(d.checked === true)}
            />
          </div>
          <div className={styles.field}>
            <label>{t(L.containsSeparateInspectionSteps)}</label>
            <Checkbox
              checked={separateSteps === true}
              onChange={(_, d) => setSeparateSteps(d.checked === true)}
            />
          </div>
          <div className={styles.field}>
            <label>{t(L.closeAutomaticallyOnPass)}</label>
            <Checkbox
              checked={closeOnPass === true}
              onChange={(_, d) => setCloseOnPass(d.checked === true)}
            />
          </div>
          <div className={styles.field}>
            <label>{t(L.closeAutomaticallyOnFail)}</label>
            <Checkbox
              checked={closeOnFail === true}
              onChange={(_, d) => setCloseOnFail(d.checked === true)}
            />
          </div>
          <div className={styles.field}>
            <label>{t(L.futureHoldCreationMode)}</label>
            <select
              className={styles.select}
              value={futureHoldMode}
              onChange={(e) => setFutureHoldMode(e.target.value)}
            >
              <option value="None">{t(L.futureHoldNone)}</option>
              <option value="Always">{t(L.futureHoldAlways)}</option>
              <option value="OnFail">{t(L.futureHoldOnFail)}</option>
            </select>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <div className={styles.row}>
            <Button
              size="small"
              onClick={() =>
                setSteps([...steps, { name: "", inProcess: false, flow: "", step: "" }])
              }
            >
              + {t(L.addStep)}
            </Button>
          </div>
          {steps.map((s, i) => (
            <div key={i} className={styles.row}>
              <Input
                placeholder={t(L.stepName)}
                value={s.name}
                onChange={(_, d) =>
                  setSteps(steps.map((x, j) => (j === i ? { ...x, name: d.value } : x)))
                }
              />
              <Checkbox
                label={t(L.isInProcessInspection)}
                checked={s.inProcess === true}
                onChange={(_, d) =>
                  setSteps(
                    steps.map((x, j) => (j === i ? { ...x, inProcess: d.checked === true } : x)),
                  )
                }
              />
              <Input
                placeholder={t(L.inspectionFlow)}
                value={s.flow}
                onChange={(_, d) =>
                  setSteps(steps.map((x, j) => (j === i ? { ...x, flow: d.value } : x)))
                }
              />
              <Input
                placeholder={t(L.inspectionStep)}
                value={s.step}
                onChange={(_, d) =>
                  setSteps(steps.map((x, j) => (j === i ? { ...x, step: d.value } : x)))
                }
              />
              <Button size="small" onClick={() => setSteps(steps.filter((_, j) => j !== i))}>
                {t(L.remove)}
              </Button>
            </div>
          ))}
        </>
      )}
    </BaseDialog>
  );
}
