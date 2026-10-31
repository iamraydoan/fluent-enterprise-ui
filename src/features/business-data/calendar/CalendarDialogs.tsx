import { useState } from "react";
import { Dismiss16Regular } from "@/components/icons";
import { Button, Checkbox, Input, Text, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { cardSurface } from "@/styles/shared";
import type { OperationValues } from "../components/operationTypes";

const useDialogStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "24px",
    boxSizing: "border-box",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  surface: {
    width: "min(640px, calc(100vw - 48px))",
    maxHeight: "min(620px, calc(100vh - 48px))",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    ...cardSurface,
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "52px",
    padding: "0 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  closeButton: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: "6px",
    borderRadius: tokens.borderRadiusMedium,
    display: "flex",
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  body: { flexGrow: 1, minHeight: 0, overflowY: "auto", padding: "16px 24px" },
  foot: {
    display: "flex",
    justifyContent: "flex-end",
    columnGap: "8px",
    padding: "12px 24px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
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
  title,
  onClose,
  onSubmit,
  submitLabel,
  children,
}: {
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel: string;
  children: React.ReactNode;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.surface} onClick={(event) => event.stopPropagation()}>
        <div className={styles.head}>
          <Text weight="semibold">{title}</Text>
          <button className={styles.closeButton} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss16Regular />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        <div className={styles.foot}>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={onSubmit}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
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

  if (!open) return null;

  return (
    <DialogShell
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

  if (!open) return null;

  return (
    <DialogShell
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

  if (!open) return null;

  return (
    <DialogShell
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
