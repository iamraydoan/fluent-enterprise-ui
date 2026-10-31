import { useState } from "react";
import { Button, Checkbox, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
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
    gap: "16px",
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
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
  field: { display: "grid", gridTemplateColumns: "200px 1fr", gap: "12px", alignItems: "center" },
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

export function MaintenancePlanDialog({ mode, initialName, onClose }: DialogProps) {
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
  const [scope, setScope] = useState("MaintenanceManagement");
  const [activities, setActivities] = useState<
    { name: string; scheduleType: string; expectedDuration: string; executionRole: string }[]
  >([]);

  const title =
    mode === MODE_CREATE ? L.createTitle : mode === MODE_EDIT ? L.editTitle : L.cloneTitle;
  const canSubmit = name.trim().length > 0;

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
          <span className={step === 1 ? styles.stepActive : styles.step}>{t(L.step1)}</span>
          <span className={step === 2 ? styles.stepActive : styles.step}>{t(L.step2)}</span>
          <span className={step === 3 ? styles.stepActive : styles.step}>{t(L.step3)}</span>
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
                <label>{t(L.scope)}</label>
                <select
                  className={styles.select}
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                >
                  <option value="MaintenanceManagement">{t(L.scopeMaintenanceManagement)}</option>
                  <option value="InProcessVerification">{t(L.scopeInProcessVerification)}</option>
                  <option value="Qualification">{t(L.scopeQualification)}</option>
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
                      setActivities(
                        activities.map((x, j) => (j === i ? { ...x, name: d.value } : x)),
                      )
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
                        activities.map((x, j) =>
                          j === i ? { ...x, expectedDuration: d.value } : x,
                        ),
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
        </div>
        <div className={styles.footer}>
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
        </div>
      </div>
    </div>
  );
}
