import { useState } from "react";
import { BaseDialog, DialogFooter, FormField } from "@/components/common";
import { Checkbox, Input, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";
import type { OperationValues } from "../components/operationTypes";

const useDialogStyles = makeStyles({
  fieldLabel: { fontSize: "13px", color: theme.color.textSecondary, textAlign: "right" },
  hint: { fontSize: "13px", color: theme.color.textSecondary, marginBottom: "16px" },
});

function DialogShell({
  open,
  title,
  onClose,
  onSubmit,
  submitLabel,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel: string;
  children: React.ReactNode;
}) {
  return (
    <BaseDialog
      open={open}
      title={title}
      onClose={onClose}
      size="lg"
      footer={<DialogFooter onCancel={onClose} onConfirm={onSubmit} confirmLabel={submitLabel} />}
    >
      {children}
    </BaseDialog>
  );
}

export function GenerateCalendarDaysDialog({
  open,
  calendarName,
  onClose,
}: {
  open: boolean;
  calendarName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [override, setOverride] = useState(false);
  const [comment, setComment] = useState("");

  return (
    <DialogShell
      open={open}
      title={t("businessData.calendar.operations.generateDays")}
      onClose={onClose}
      onSubmit={onClose}
      submitLabel={t("businessData.calendar.operations.generate")}
    >
      <div className={styles.hint}>
        {t("businessData.calendar.operations.generateDaysHint", { name: calendarName })}
      </div>
      <FormField
        label={
          <>
            <span className={styles.fieldLabel}>
              {t("businessData.calendar.operations.startDate")}
            </span>
          </>
        }
        labelWidth="190px"
      >
        <Input type="date" value={startDate} onChange={setStartDate} />
      </FormField>
      <FormField
        label={
          <>
            <span className={styles.fieldLabel}>
              {t("businessData.calendar.operations.endDate")}
            </span>
          </>
        }
        labelWidth="190px"
      >
        <Input type="date" value={endDate} onChange={setEndDate} />
      </FormField>
      <FormField
        label={
          <>
            <span />
          </>
        }
        labelWidth="190px"
      >
        <Checkbox
          label={t("businessData.calendar.operations.overrideExisting")}
          checked={override}
          onChange={setOverride}
        />
      </FormField>
      <FormField
        label={
          <>
            <span className={styles.fieldLabel}>
              {t("businessData.calendar.operations.comment")}
            </span>
          </>
        }
        labelWidth="190px"
      >
        <Input value={comment} onChange={setComment} />
      </FormField>
    </DialogShell>
  );
}

export function EditCalendarDaysDialog({
  open,
  calendarName,
  onClose,
}: {
  open: boolean;
  calendarName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [shiftDefinition, setShiftDefinition] = useState("");
  const [values, setValues] = useState<OperationValues>({});

  return (
    <DialogShell
      open={open}
      title={t("businessData.calendar.operations.editDays")}
      onClose={onClose}
      onSubmit={onClose}
      submitLabel={t("common.save")}
    >
      <div className={styles.hint}>
        {t("businessData.calendar.operations.editDaysHint", { name: calendarName })}
      </div>
      <FormField
        label={
          <>
            <span className={styles.fieldLabel}>
              {t("businessData.calendar.operations.shiftDefinition")}
            </span>
          </>
        }
        labelWidth="190px"
      >
        <Input
          value={shiftDefinition}
          onChange={setShiftDefinition}
          placeholder={t("businessData.calendar.operations.shiftDefinitionPlaceholder")}
        />
      </FormField>
      <FormField
        label={
          <>
            <span className={styles.fieldLabel}>
              {t("businessData.calendar.operations.fiscalYear")}
            </span>
          </>
        }
        labelWidth="190px"
      >
        <Input
          value={String(values.fiscalYear ?? "")}
          onChange={(value) => setValues((p) => ({ ...p, fiscalYear: value }))}
        />
      </FormField>
      <FormField
        label={
          <>
            <span className={styles.fieldLabel}>
              {t("businessData.calendar.operations.fiscalQuarter")}
            </span>
          </>
        }
        labelWidth="190px"
      >
        <Input
          value={String(values.fiscalQuarter ?? "")}
          onChange={(value) => setValues((p) => ({ ...p, fiscalQuarter: value }))}
        />
      </FormField>
    </DialogShell>
  );
}

export function RemoveCalendarDaysDialog({
  open,
  calendarName,
  onClose,
}: {
  open: boolean;
  calendarName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <DialogShell
      open={open}
      title={t("businessData.calendar.operations.removeDays")}
      onClose={onClose}
      onSubmit={onClose}
      submitLabel={t("businessData.calendar.operations.remove")}
    >
      <div className={styles.hint}>
        {t("businessData.calendar.operations.removeDaysHint", { name: calendarName })}
      </div>
      <FormField
        label={
          <>
            <span className={styles.fieldLabel}>
              {t("businessData.calendar.operations.startDate")}
            </span>
          </>
        }
        labelWidth="190px"
      >
        <Input type="date" value={startDate} onChange={setStartDate} />
      </FormField>
      <FormField
        label={
          <>
            <span className={styles.fieldLabel}>
              {t("businessData.calendar.operations.endDate")}
            </span>
          </>
        }
        labelWidth="190px"
      >
        <Input type="date" value={endDate} onChange={setEndDate} />
      </FormField>
    </DialogShell>
  );
}
