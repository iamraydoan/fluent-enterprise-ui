import { useState } from "react";
import { Button, Checkbox, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { MODE_CREATE, MODE_EDIT } from "./wizardMode";
import type { WizardMode } from "./wizardMode";

const EMPTY_VALUE = "—";

const L: Record<string, TranslationKey> = {
  createTitle: "businessData.employee.dialog.createTitle",
  editTitle: "businessData.employee.dialog.editTitle",
  cloneTitle: "businessData.employee.dialog.cloneTitle",
  step1: "businessData.employee.dialog.step1",
  step2: "businessData.employee.dialog.step2",
  step3: "businessData.employee.dialog.step3",
  user: "businessData.employee.dialog.user",
  userAccount: "businessData.employee.dialog.userAccount",
  userName: "businessData.employee.dialog.userName",
  userEmail: "businessData.employee.dialog.userEmail",
  primaryRole: "businessData.employee.dialog.primaryRole",
  name: "businessData.employee.dialog.name",
  description: "businessData.employee.dialog.description",
  type: "businessData.employee.dialog.type",
  employeeNumber: "businessData.employee.dialog.employeeNumber",
  area: "businessData.employee.dialog.area",
  calendar: "businessData.employee.dialog.calendar",
  costPerHour: "businessData.employee.dialog.costPerHour",
  costCenter: "businessData.employee.dialog.costCenter",
  requireClockIn: "businessData.employee.dialog.requireClockIn",
  automaticClockIn: "businessData.employee.dialog.automaticClockIn",
  automaticClockOutAtEndOfShift: "businessData.employee.dialog.automaticClockOutAtEndOfShift",
  back: "businessData.employee.dialog.back",
  next: "businessData.employee.dialog.next",
  cancel: "businessData.employee.dialog.cancel",
  create: "businessData.employee.dialog.create",
  save: "businessData.employee.dialog.save",
  clone: "businessData.employee.dialog.clone",
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
  field: { display: "grid", gridTemplateColumns: "220px 1fr", gap: "12px", alignItems: "center" },
});

interface DialogProps {
  mode: WizardMode;
  initialName?: string;
  onClose: () => void;
}

export function EmployeeDialog({ mode, initialName, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
  const [step, setStep] = useState(1);
  const [user, setUser] = useState("");
  const [userAccount, setUserAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [primaryRole, setPrimaryRole] = useState("");
  const [name, setName] = useState(initialName ?? "");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [area, setArea] = useState("");
  const [calendar, setCalendar] = useState("");
  const [costPerHour, setCostPerHour] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [requireClockIn, setRequireClockIn] = useState(false);
  const [automaticClockIn, setAutomaticClockIn] = useState(false);
  const [automaticClockOut, setAutomaticClockOut] = useState(false);

  const title =
    mode === MODE_CREATE ? L.createTitle : mode === MODE_EDIT ? L.editTitle : L.cloneTitle;
  const canSubmit = name.trim().length > 0 && employeeNumber.trim().length > 0;

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
                <label>
                  <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
                  {t(L.user)}
                </label>
                <Input value={user} onChange={(_, d) => setUser(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.userAccount)}</label>
                <Input value={userAccount} onChange={(_, d) => setUserAccount(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.userName)}</label>
                <Input value={userName} onChange={(_, d) => setUserName(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.userEmail)}</label>
                <Input value={userEmail} onChange={(_, d) => setUserEmail(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.primaryRole)}</label>
                <Input value={primaryRole} onChange={(_, d) => setPrimaryRole(d.value)} />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className={styles.field}>
                <label>{t(L.user)}</label>
                <span>{user || EMPTY_VALUE}</span>
              </div>
              <div className={styles.field}>
                <label>{t(L.userAccount)}</label>
                <span>{userAccount || EMPTY_VALUE}</span>
              </div>
              <div className={styles.field}>
                <label>{t(L.userName)}</label>
                <span>{userName || EMPTY_VALUE}</span>
              </div>
              <div className={styles.field}>
                <label>{t(L.userEmail)}</label>
                <span>{userEmail || EMPTY_VALUE}</span>
              </div>
            </>
          )}
          {step === 3 && (
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
                <label>
                  <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
                  {t(L.employeeNumber)}
                </label>
                <Input value={employeeNumber} onChange={(_, d) => setEmployeeNumber(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.area)}</label>
                <Input value={area} onChange={(_, d) => setArea(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.calendar)}</label>
                <Input value={calendar} onChange={(_, d) => setCalendar(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.costPerHour)}</label>
                <Input value={costPerHour} onChange={(_, d) => setCostPerHour(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.costCenter)}</label>
                <Input value={costCenter} onChange={(_, d) => setCostCenter(d.value)} />
              </div>
              <div className={styles.field}>
                <label>{t(L.requireClockIn)}</label>
                <Checkbox
                  checked={requireClockIn === true}
                  onChange={(_, d) => setRequireClockIn(d.checked === true)}
                />
              </div>
              <div className={styles.field}>
                <label>{t(L.automaticClockIn)}</label>
                <Checkbox
                  checked={automaticClockIn === true}
                  onChange={(_, d) => setAutomaticClockIn(d.checked === true)}
                  disabled={!requireClockIn}
                />
              </div>
              <div className={styles.field}>
                <label>{t(L.automaticClockOutAtEndOfShift)}</label>
                <Checkbox
                  checked={automaticClockOut === true}
                  onChange={(_, d) => setAutomaticClockOut(d.checked === true)}
                />
              </div>
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
              disabled={step === 1 && !user.trim()}
            >
              {t(L.next)}
            </Button>
          ) : (
            <Button appearance="primary" onClick={onClose} disabled={!canSubmit}>
              {t(mode === MODE_CREATE ? L.create : mode === MODE_EDIT ? L.save : L.clone)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
