import { useState } from "react";
import { BaseDialog, FormField, HStack } from "@/components/common";
import { Button, Checkbox, Input, Textarea, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";
import { MODE_CREATE, MODE_EDIT } from "../../components/wizardMode";
import type { WizardMode } from "../../components/wizardMode";

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
});

interface DialogProps {
  mode: WizardMode;
  initialName?: string;
  onClose: () => void;
}

export function EmployeeDialog({ mode, initialName, onClose }: DialogProps) {
  const { t } = useAppTranslation();
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
    <BaseDialog
      open
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
              disabled={step === 1 && !user.trim()}
            >
              {t(L.next)}
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose} disabled={!canSubmit}>
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
          <FormField
            label={
              <>
                <span style={{ color: theme.color.textDanger }}>* </span>
                {t(L.user)}
              </>
            }
            labelWidth="220px"
          >
            <Input value={user} onChange={setUser} />
          </FormField>
          <FormField label={<>{t(L.userAccount)}</>} labelWidth="220px">
            <Input value={userAccount} onChange={setUserAccount} />
          </FormField>
          <FormField label={<>{t(L.userName)}</>} labelWidth="220px">
            <Input value={userName} onChange={setUserName} />
          </FormField>
          <FormField label={<>{t(L.userEmail)}</>} labelWidth="220px">
            <Input value={userEmail} onChange={setUserEmail} />
          </FormField>
          <FormField label={<>{t(L.primaryRole)}</>} labelWidth="220px">
            <Input value={primaryRole} onChange={setPrimaryRole} />
          </FormField>
        </>
      )}
      {step === 2 && (
        <>
          <FormField label={<>{t(L.user)}</>} labelWidth="220px">
            <span>{user || EMPTY_VALUE}</span>
          </FormField>
          <FormField label={<>{t(L.userAccount)}</>} labelWidth="220px">
            <span>{userAccount || EMPTY_VALUE}</span>
          </FormField>
          <FormField label={<>{t(L.userName)}</>} labelWidth="220px">
            <span>{userName || EMPTY_VALUE}</span>
          </FormField>
          <FormField label={<>{t(L.userEmail)}</>} labelWidth="220px">
            <span>{userEmail || EMPTY_VALUE}</span>
          </FormField>
        </>
      )}
      {step === 3 && (
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
          <FormField
            label={
              <>
                <span style={{ color: theme.color.textDanger }}>* </span>
                {t(L.employeeNumber)}
              </>
            }
            labelWidth="220px"
          >
            <Input value={employeeNumber} onChange={setEmployeeNumber} />
          </FormField>
          <FormField label={<>{t(L.area)}</>} labelWidth="220px">
            <Input value={area} onChange={setArea} />
          </FormField>
          <FormField label={<>{t(L.calendar)}</>} labelWidth="220px">
            <Input value={calendar} onChange={setCalendar} />
          </FormField>
          <FormField label={<>{t(L.costPerHour)}</>} labelWidth="220px">
            <Input value={costPerHour} onChange={setCostPerHour} />
          </FormField>
          <FormField label={<>{t(L.costCenter)}</>} labelWidth="220px">
            <Input value={costCenter} onChange={setCostCenter} />
          </FormField>
          <FormField label={<>{t(L.requireClockIn)}</>} labelWidth="220px">
            <Checkbox checked={requireClockIn === true} onChange={setRequireClockIn} />
          </FormField>
          <FormField label={<>{t(L.automaticClockIn)}</>} labelWidth="220px">
            <Checkbox
              checked={automaticClockIn === true}
              onChange={setAutomaticClockIn}
              disabled={!requireClockIn}
            />
          </FormField>
          <FormField label={<>{t(L.automaticClockOutAtEndOfShift)}</>} labelWidth="220px">
            <Checkbox checked={automaticClockOut === true} onChange={setAutomaticClockOut} />
          </FormField>
        </>
      )}
    </BaseDialog>
  );
}
