import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Checkbox, Input, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { OperationValues } from "../components/operationTypes";

const useDialogStyles = makeStyles({
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "190px minmax(0, 1fr)",
    alignItems: "center",
    columnGap: "12px",
    marginBottom: "12px",
  },
  fieldLabel: { fontSize: "13px", color: tokens.colorNeutralForeground2, textAlign: "right" },
  hint: { fontSize: "13px", color: tokens.colorNeutralForeground2, marginBottom: "16px" },
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
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.calendar.operations.startDate")}</span>
        <Input type="date" value={startDate} onChange={(_, data) => setStartDate(data.value)} />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.calendar.operations.endDate")}</span>
        <Input type="date" value={endDate} onChange={(_, data) => setEndDate(data.value)} />
      </div>
      <div className={styles.fieldRow}>
        <span />
        <Checkbox
          label={t("businessData.calendar.operations.overrideExisting")}
          checked={override}
          onChange={(_, data) => setOverride(data.checked === true)}
        />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.calendar.operations.comment")}</span>
        <Input value={comment} onChange={(_, data) => setComment(data.value)} />
      </div>
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
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.calendar.operations.shiftDefinition")}
        </span>
        <Input
          value={shiftDefinition}
          onChange={(_, data) => setShiftDefinition(data.value)}
          placeholder={t("businessData.calendar.operations.shiftDefinitionPlaceholder")}
        />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.calendar.operations.fiscalYear")}
        </span>
        <Input
          value={String(values.fiscalYear ?? "")}
          onChange={(_, data) => setValues((p) => ({ ...p, fiscalYear: data.value }))}
        />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>
          {t("businessData.calendar.operations.fiscalQuarter")}
        </span>
        <Input
          value={String(values.fiscalQuarter ?? "")}
          onChange={(_, data) => setValues((p) => ({ ...p, fiscalQuarter: data.value }))}
        />
      </div>
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
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.calendar.operations.startDate")}</span>
        <Input type="date" value={startDate} onChange={(_, data) => setStartDate(data.value)} />
      </div>
      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>{t("businessData.calendar.operations.endDate")}</span>
        <Input type="date" value={endDate} onChange={(_, data) => setEndDate(data.value)} />
      </div>
    </DialogShell>
  );
}
