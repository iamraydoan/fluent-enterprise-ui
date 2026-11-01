import { useState } from "react";
import { BaseDialog, FormField, HStack  } from "@/components/common";
import { Button, Checkbox, Input, Textarea, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";
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
          <FormField label={<>{t(L.changeSet)}</>} labelWidth="200px">
            <Input value={changeSet} onChange={setChangeSet} disabled={useAutoCs} />
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
              onChange={setUseAutoCs}
            />
          </FormField>
          <FormField label={<>{t(L.approvalRole)}</>} labelWidth="200px">
            <Input value={approvalRole} onChange={setApprovalRole} />
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
            labelWidth="200px"
          >
            <Input value={name} onChange={setName} disabled={mode === MODE_EDIT} />
          </FormField>
          <FormField label={<>{t(L.description)}</>} labelWidth="200px">
            <Textarea value={description} onChange={setDescription} />
          </FormField>
          <FormField label={<>{t(L.type)}</>} labelWidth="200px">
            <Input value={type} onChange={setType} />
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
          <HStack gap="8px" align="center">
            <Button
              size="sm"
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
          </HStack>
          {activities.map((a, i) => (
            <HStack gap="8px" align="center" key={i}>
              <Input
                placeholder={t(L.activityName)}
                value={a.name}
                onChange={(value) =>
                  setActivities(activities.map((x, j) => (j === i ? { ...x, name: value } : x)))
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
                onChange={(value) =>
                  setActivities(
                    activities.map((x, j) => (j === i ? { ...x, expectedDuration: value } : x)),
                  )
                }
              />
              <Button size="sm" onClick={() => setActivities(activities.filter((_, j) => j !== i))}>
                {t(L.remove)}
              </Button>
            </HStack>
          ))}
        </>
      )}
    </BaseDialog>
  );
}
