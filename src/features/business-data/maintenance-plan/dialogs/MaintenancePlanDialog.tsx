import { useState } from "react";
import { BaseDialog, FormField } from "@/components/common";
import { Button, Checkbox, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { MODE_CREATE, MODE_EDIT } from "../../components/wizardMode";
import type { WizardMode } from "../../components/wizardMode";

const SCHEDULE_TYPE_AD_HOC = "AdHoc";

const L: Record<string, TranslationKey> = {
  createTitle: "businessData.maintenancePlan.dialog.createTitle",
  editTitle: "businessData.maintenancePlan.dialog.editTitle",
  cloneTitle: "businessData.maintenancePlan.dialog.cloneTitle",
  step1: "businessData.maintenancePlan.dialog.step1",
  step2: "businessData.maintenancePlan.dialog.step2",
  step3: "businessData.maintenancePlan.dialog.step3",
  changeSet: "businessData.maintenancePlan.dialog.changeSet",
  useAutomaticChangeSet: "businessData.maintenancePlan.dialog.useAutomaticChangeSet",
  approvalRole: "businessData.maintenancePlan.dialog.approvalRole",
  makeEffectiveOnApproval: "businessData.maintenancePlan.dialog.makeEffectiveOnApproval",
  name: "businessData.maintenancePlan.dialog.name",
  description: "businessData.maintenancePlan.dialog.description",
  type: "businessData.maintenancePlan.dialog.type",
  scope: "businessData.maintenancePlan.dialog.scope",
  scopeMaintenanceManagement: "businessData.maintenancePlan.dialog.scopeMaintenanceManagement",
  scopeInProcessVerification: "businessData.maintenancePlan.dialog.scopeInProcessVerification",
  scopeQualification: "businessData.maintenancePlan.dialog.scopeQualification",
  addActivity: "businessData.maintenancePlan.dialog.addActivity",
  remove: "businessData.maintenancePlan.dialog.remove",
  activityName: "businessData.maintenancePlan.dialog.activityName",
  scheduleType: "businessData.maintenancePlan.dialog.scheduleType",
  scheduleAdHoc: "businessData.maintenancePlan.dialog.scheduleAdHoc",
  scheduleTimeBased: "businessData.maintenancePlan.dialog.scheduleTimeBased",
  scheduleUsageBased: "businessData.maintenancePlan.dialog.scheduleUsageBased",
  scheduleUsageAndTimeBased: "businessData.maintenancePlan.dialog.scheduleUsageAndTimeBased",
  expectedDuration: "businessData.maintenancePlan.dialog.expectedDuration",
  executionRole: "businessData.maintenancePlan.dialog.executionRole",
  back: "businessData.maintenancePlan.dialog.back",
  next: "businessData.maintenancePlan.dialog.next",
  cancel: "businessData.maintenancePlan.dialog.cancel",
  create: "businessData.maintenancePlan.dialog.create",
  save: "businessData.maintenancePlan.dialog.save",
  clone: "businessData.maintenancePlan.dialog.clone",
};

const useDialogStyles = makeStyles({
  steps: {
    display: "flex",
    gap: "16px",
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
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
  open: boolean;
  mode: WizardMode;
  initialName?: string;
  onClose: () => void;
}

export function MaintenancePlanDialog({ open, mode, initialName, onClose }: DialogProps) {
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
  const [scope, setScope] = useState("MaintenanceManagement");
  const [activities, setActivities] = useState<
    { name: string; scheduleType: string; expectedDuration: string; executionRole: string }[]
  >([]);

  const title =
    mode === MODE_CREATE ? L.createTitle : mode === MODE_EDIT ? L.editTitle : L.cloneTitle;
  const canSubmit = name.trim().length > 0;

  return (
    <BaseDialog
      open={open}
      title={t(title)}
      onClose={onClose}
      size="lg"
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
          <FormField label={<>{t(L.changeSet)}</>} labelWidth="200px">
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
            labelWidth="200px"
          >
            <Checkbox
              label={t(L.useAutomaticChangeSet)}
              checked={useAutoCs === true}
              onChange={(_, d) => setUseAutoCs(d.checked === true)}
            />
          </FormField>
          <FormField label={<>{t(L.approvalRole)}</>} labelWidth="200px">
            <Input value={approvalRole} onChange={(_, d) => setApprovalRole(d.value)} />
          </FormField>
          <FormField
            label={
              <>
                <span />
              </>
            }
            labelWidth="200px"
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
            labelWidth="200px"
          >
            <Input
              value={name}
              onChange={(_, d) => setName(d.value)}
              disabled={mode === MODE_EDIT}
            />
          </FormField>
          <FormField label={<>{t(L.description)}</>} labelWidth="200px">
            <Textarea value={description} onChange={(_, d) => setDescription(d.value)} />
          </FormField>
          <FormField label={<>{t(L.type)}</>} labelWidth="200px">
            <Input value={type} onChange={(_, d) => setType(d.value)} />
          </FormField>
          <FormField label={<>{t(L.scope)}</>} labelWidth="200px">
            <select
              className={styles.select}
              value={scope}
              onChange={(e) => setScope(e.target.value)}
            >
              <option value="MaintenanceManagement">{t(L.scopeMaintenanceManagement)}</option>
              <option value="InProcessVerification">{t(L.scopeInProcessVerification)}</option>
              <option value="Qualification">{t(L.scopeQualification)}</option>
            </select>
          </FormField>
        </>
      )}
      {step === 3 && (
        <>
          <div className={styles.row}>
            <Button
              size="small"
              onClick={() =>
                setActivities([
                  ...activities,
                  {
                    name: "",
                    scheduleType: SCHEDULE_TYPE_AD_HOC,
                    expectedDuration: "",
                    executionRole: "",
                  },
                ])
              }
            >
              + {t(L.addActivity)}
            </Button>
          </div>
          {activities.map((a, i) => (
            <div key={i} className={styles.row}>
              <Input
                placeholder={t(L.activityName)}
                value={a.name}
                onChange={(_, d) =>
                  setActivities(activities.map((x, j) => (j === i ? { ...x, name: d.value } : x)))
                }
              />
              <select
                className={styles.select}
                value={a.scheduleType}
                onChange={(e) =>
                  setActivities(
                    activities.map((x, j) =>
                      j === i ? { ...x, scheduleType: e.target.value } : x,
                    ),
                  )
                }
              >
                <option value={SCHEDULE_TYPE_AD_HOC}>{t(L.scheduleAdHoc)}</option>
                <option value="TimeBased">{t(L.scheduleTimeBased)}</option>
                <option value="UsageBased">{t(L.scheduleUsageBased)}</option>
                <option value="UsageAndTimeBased">{t(L.scheduleUsageAndTimeBased)}</option>
              </select>
              <Input
                placeholder={t(L.expectedDuration)}
                value={a.expectedDuration}
                onChange={(_, d) =>
                  setActivities(
                    activities.map((x, j) => (j === i ? { ...x, expectedDuration: d.value } : x)),
                  )
                }
              />
              <Button
                size="small"
                onClick={() => setActivities(activities.filter((_, j) => j !== i))}
              >
                {t(L.remove)}
              </Button>
            </div>
          ))}
        </>
      )}
    </BaseDialog>
  );
}
