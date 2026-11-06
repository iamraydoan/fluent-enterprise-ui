import { useState } from "react";
import { BaseDialog, FormField, HStack } from "@/components/common";
import { Button, Checkbox, Input, Textarea, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";
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
    padding: "4px 4px 12px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    marginBottom: theme.spacing.xs,
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
      <HStack gap="16px" className={styles.steps}>
        <span className={step === 1 ? styles.stepActive : styles.step}>{t(L.step1)}</span>
        <span className={step === 2 ? styles.stepActive : styles.step}>{t(L.step2)}</span>
        <span className={step === 3 ? styles.stepActive : styles.step}>{t(L.step3)}</span>
      </HStack>
      {step === 1 && (
        <>
          <FormField label={<>{t(L.changeSet)}</>} labelWidth="220px">
            <Input value={changeSet} onChange={setChangeSet} disabled={useAutoCs} />
          </FormField>
          <FormField
            label={
              <>
                <span />
              </>
            }
            labelWidth="220px"
          >
            <Checkbox
              label={t(L.useAutomaticChangeSet)}
              checked={useAutoCs === true}
              onChange={setUseAutoCs}
            />
          </FormField>
          <FormField label={<>{t(L.approvalRole)}</>} labelWidth="220px">
            <Input value={approvalRole} onChange={setApprovalRole} />
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
            labelWidth="220px"
          >
            <Input value={name} onChange={setName} disabled={mode === MODE_EDIT} />
          </FormField>
          <FormField label={<>{t(L.description)}</>} labelWidth="220px">
            <Textarea value={description} onChange={setDescription} />
          </FormField>
          <FormField label={<>{t(L.type)}</>} labelWidth="220px">
            <Input value={type} onChange={setType} />
          </FormField>
          <FormField label={<>{t(L.resultsRequiredBeforeTrackOut)}</>} labelWidth="220px">
            <Checkbox checked={resultsRequired === true} onChange={setResultsRequired} />
          </FormField>
          <FormField label={<>{t(L.enableMultipleSamples)}</>} labelWidth="220px">
            <Checkbox checked={multipleSamples === true} onChange={setMultipleSamples} />
          </FormField>
          <FormField label={<>{t(L.containsSeparateInspectionSteps)}</>} labelWidth="220px">
            <Checkbox checked={separateSteps === true} onChange={setSeparateSteps} />
          </FormField>
          <FormField label={<>{t(L.closeAutomaticallyOnPass)}</>} labelWidth="220px">
            <Checkbox checked={closeOnPass === true} onChange={setCloseOnPass} />
          </FormField>
          <FormField label={<>{t(L.closeAutomaticallyOnFail)}</>} labelWidth="220px">
            <Checkbox checked={closeOnFail === true} onChange={setCloseOnFail} />
          </FormField>
          <FormField label={<>{t(L.futureHoldCreationMode)}</>} labelWidth="220px">
            <select
              className={styles.select}
              value={futureHoldMode}
              onChange={(e) => setFutureHoldMode(e.target.value)}
            >
              <option value="None">{t(L.futureHoldNone)}</option>
              <option value="Always">{t(L.futureHoldAlways)}</option>
              <option value="OnFail">{t(L.futureHoldOnFail)}</option>
            </select>
          </FormField>
        </>
      )}
      {step === 3 && (
        <>
          <HStack gap="8px" align="center">
            <Button
              size="sm"
              onClick={() =>
                setSteps([...steps, { name: "", inProcess: false, flow: "", step: "" }])
              }
            >
              + {t(L.addStep)}
            </Button>
          </HStack>
          {steps.map((s, i) => (
            <HStack gap="8px" align="center" key={i}>
              <Input
                placeholder={t(L.stepName)}
                value={s.name}
                onChange={(value) =>
                  setSteps(steps.map((x, j) => (j === i ? { ...x, name: value } : x)))
                }
              />
              <Checkbox
                label={t(L.isInProcessInspection)}
                checked={s.inProcess === true}
                onChange={(checked) =>
                  setSteps(
                    steps.map((x, j) => (j === i ? { ...x, inProcess: checked === true } : x)),
                  )
                }
              />
              <Input
                placeholder={t(L.inspectionFlow)}
                value={s.flow}
                onChange={(value) =>
                  setSteps(steps.map((x, j) => (j === i ? { ...x, flow: value } : x)))
                }
              />
              <Input
                placeholder={t(L.inspectionStep)}
                value={s.step}
                onChange={(value) =>
                  setSteps(steps.map((x, j) => (j === i ? { ...x, step: value } : x)))
                }
              />
              <Button size="sm" onClick={() => setSteps(steps.filter((_, j) => j !== i))}>
                {t(L.remove)}
              </Button>
            </HStack>
          ))}
        </>
      )}
    </BaseDialog>
  );
}
