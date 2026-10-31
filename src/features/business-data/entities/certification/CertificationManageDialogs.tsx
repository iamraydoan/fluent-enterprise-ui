import { useState } from "react";
import { Dismiss16Regular } from "@/components/icons";
import { Button, Checkbox, Input, Text, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { cardSurface } from "@/styles/shared";
import type { OperationValues } from "../../components/operationTypes";

interface EmployeeRow {
  id: number;
  employee: string;
  granted: boolean;
}

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
    width: "min(680px, calc(100vw - 48px))",
    maxHeight: "min(640px, calc(100vh - 48px))",
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
    gridTemplateColumns: "170px minmax(0, 1fr)",
    alignItems: "center",
    columnGap: "12px",
    marginBottom: "12px",
  },
  fieldLabel: { fontSize: "13px", color: tokens.colorNeutralForeground2, textAlign: "right" },
  hint: { fontSize: "13px", color: tokens.colorNeutralForeground2, marginBottom: "16px" },
  empRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto auto",
    columnGap: "12px",
    alignItems: "center",
    marginBottom: "8px",
  },
  empty: { padding: "16px", textAlign: "center", color: tokens.colorNeutralForeground3 },
});

function EmployeeListEditor({
  values,
  onChange,
  showGranted,
}: {
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
  showGranted?: boolean;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const rows = (values.employees as unknown as EmployeeRow[] | undefined) ?? [];

  const setRows = (next: EmployeeRow[]) => onChange("employees", next as unknown as boolean);
  const addRow = () =>
    setRows([...rows, { id: Date.now() + rows.length, employee: "", granted: false }]);
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));

  return (
    <div>
      {rows.length === 0 && (
        <div className={styles.empty}>{t("businessData.certification.operations.noEmployees")}</div>
      )}
      {rows.map((row) => (
        <div key={row.id} className={styles.empRow}>
          <Input
            placeholder={t("businessData.certification.operations.employeeName")}
            value={row.employee}
            onChange={(_, data) =>
              setRows(rows.map((r) => (r.id === row.id ? { ...r, employee: data.value } : r)))
            }
          />
          {showGranted ? (
            <Checkbox
              label={t("businessData.certification.operations.granted")}
              checked={row.granted}
              onChange={(_, data) =>
                setRows(
                  rows.map((r) => (r.id === row.id ? { ...r, granted: data.checked === true } : r)),
                )
              }
            />
          ) : (
            <span />
          )}
          <Button appearance="secondary" onClick={() => removeRow(row.id)}>
            {t("common.remove")}
          </Button>
        </div>
      ))}
      <Button appearance="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </div>
  );
}

function EmployeeDialogShell({
  title,
  hint,
  submitLabel,
  showGranted,
  onClose,
}: {
  title: string;
  hint: string;
  submitLabel: string;
  showGranted?: boolean;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [values, setValues] = useState<OperationValues>({});
  const [remark, setRemark] = useState("");
  const [plannedDate, setPlannedDate] = useState("");

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.surface} onClick={(event) => event.stopPropagation()}>
        <div className={styles.head}>
          <Text weight="semibold">{title}</Text>
          <button className={styles.closeButton} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss16Regular />
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.hint}>{hint}</div>
          <EmployeeListEditor
            values={values}
            onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
            showGranted={showGranted}
          />
          <div className={styles.fieldRow} style={{ marginTop: "16px" }}>
            <span className={styles.fieldLabel}>
              {t("businessData.certification.operations.plannedDate")}
            </span>
            <Input
              type="date"
              value={plannedDate}
              onChange={(_, data) => setPlannedDate(data.value)}
            />
          </div>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>
              {t("businessData.certification.operations.remark")}
            </span>
            <Input value={remark} onChange={(_, data) => setRemark(data.value)} />
          </div>
        </div>
        <div className={styles.foot}>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={onClose}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AssignEmployeesDialog({
  open,
  certificationName,
  onClose,
}: {
  open: boolean;
  certificationName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  if (!open) return null;
  return (
    <EmployeeDialogShell
      title={t("businessData.certification.operations.assignEmployees")}
      hint={t("businessData.certification.operations.assignHint", { name: certificationName })}
      submitLabel={t("businessData.certification.operations.assign")}
      showGranted
      onClose={onClose}
    />
  );
}

export function GrantCertificationDialog({
  open,
  certificationName,
  onClose,
}: {
  open: boolean;
  certificationName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  if (!open) return null;
  return (
    <EmployeeDialogShell
      title={t("businessData.certification.operations.grantCertification")}
      hint={t("businessData.certification.operations.grantHint", { name: certificationName })}
      submitLabel={t("businessData.certification.operations.grant")}
      onClose={onClose}
    />
  );
}

export function ManageEmployeesCertificationDialog({
  open,
  certificationName,
  onClose,
}: {
  open: boolean;
  certificationName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  if (!open) return null;
  return (
    <EmployeeDialogShell
      title={t("businessData.certification.operations.manageEmployees")}
      hint={t("businessData.certification.operations.manageHint", { name: certificationName })}
      submitLabel={t("common.update")}
      showGranted
      onClose={onClose}
    />
  );
}
