import { useState } from "react";
import { BaseDialog, DialogFooter, FormField, Empty, Grid } from "@/components/common";
import { Button, Checkbox, Input, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";
import type { OperationOnChange, OperationValues } from "../components/operationTypes";

interface EmployeeRow {
  id: number;
  employee: string;
  granted: boolean;
}

const useDialogStyles = makeStyles({
  fieldLabel: { fontSize: "13px", color: theme.color.textSecondary, textAlign: "right" },
  hint: { fontSize: "13px", color: theme.color.textSecondary, marginBottom: theme.spacing.lg },
  empRow: {
    marginBottom: theme.spacing.sm,
  },
});

function EmployeeListEditor({
  values,
  onChange,
  showGranted,
}: {
  values: OperationValues;
  onChange: OperationOnChange;
  showGranted?: boolean;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const rows = (values.employees as unknown as EmployeeRow[] | undefined) ?? [];

  const setRows = (next: EmployeeRow[]) => onChange("employees", next);
  const addRow = () =>
    setRows([...rows, { id: Date.now() + rows.length, employee: "", granted: false }]);
  const removeRow = (id: number) => setRows(rows.filter((r) => r.id !== id));

  return (
    <div>
      {rows.length === 0 && <Empty>{t("businessData.certification.operations.noEmployees")}</Empty>}
      {rows.map((row) => (
        <Grid
          columns="minmax(0, 1fr) auto auto"
          gap="12px"
          align="center"
          key={row.id}
          className={styles.empRow}
        >
          <Input
            placeholder={t("businessData.certification.operations.employeeName")}
            value={row.employee}
            onChange={(value) =>
              setRows(rows.map((r) => (r.id === row.id ? { ...r, employee: value } : r)))
            }
          />
          {showGranted ? (
            <Checkbox
              label={t("businessData.certification.operations.granted")}
              checked={row.granted}
              onChange={(checked) =>
                setRows(
                  rows.map((r) => (r.id === row.id ? { ...r, granted: checked === true } : r)),
                )
              }
            />
          ) : (
            <span />
          )}
          <Button variant="secondary" onClick={() => removeRow(row.id)}>
            {t("common.remove")}
          </Button>
        </Grid>
      ))}
      <Button variant="secondary" onClick={addRow}>
        {t("common.add")}
      </Button>
    </div>
  );
}

function EmployeeDialogShell({
  open,
  title,
  hint,
  submitLabel,
  showGranted,
  onClose,
}: {
  open: boolean;
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
    <BaseDialog
      open={open}
      title={title}
      onClose={onClose}
      size="lg"
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={submitLabel} />}
    >
      <div className={styles.hint}>{hint}</div>
      <EmployeeListEditor
        values={values}
        onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
        showGranted={showGranted}
      />
      <FormField
        label={t("businessData.certification.operations.plannedDate")}
        labelWidth="170px"
        labelAlign="right"
        style={{ marginTop: theme.spacing.lg }}
      >
        <Input type="date" value={plannedDate} onChange={setPlannedDate} />
      </FormField>
      <FormField
        label={
          <>
            <span className={styles.fieldLabel}>
              {t("businessData.certification.operations.remark")}
            </span>
          </>
        }
        labelWidth="170px"
      >
        <Input value={remark} onChange={setRemark} />
      </FormField>
    </BaseDialog>
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
  return (
    <EmployeeDialogShell
      open={open}
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
  return (
    <EmployeeDialogShell
      open={open}
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
  return (
    <EmployeeDialogShell
      open={open}
      title={t("businessData.certification.operations.manageEmployees")}
      hint={t("businessData.certification.operations.manageHint", { name: certificationName })}
      submitLabel={t("common.update")}
      showGranted
      onClose={onClose}
    />
  );
}
