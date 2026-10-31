import { useState } from "react";
import { useFabResources } from "@/api";
import { BaseDialog, DialogFooter, FormField } from "@/components/common";
import { Button, Input, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const useDialogStyles = makeStyles({
  list: { display: "flex", flexDirection: "column", rowGap: "8px" },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    fontSize: "13px",
  },
});

interface ManageResourceEmployeesDialogProps {
  open: boolean;
  facilityName: string;
  onClose: () => void;
}

export function ManageResourceEmployeesDialog({
  open,
  facilityName,
  onClose,
}: ManageResourceEmployeesDialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [employees, setEmployees] = useState<string[]>(["John Doe", "Jane Smith"]);
  const [newEmployee, setNewEmployee] = useState("");

  const { data: resources = [] } = useFabResources(undefined, facilityName);

  const addEmployee = () => {
    if (newEmployee.trim()) {
      setEmployees((prev) => [...prev, newEmployee.trim()]);
      setNewEmployee("");
    }
  };

  const removeEmployee = (name: string) => {
    setEmployees((prev) => prev.filter((e) => e !== name));
  };

  return (
    <BaseDialog
      open={open}
      title={t("fabExplorer.manageResourceEmployees")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onClose}
          confirmLabel={t("fabExplorer.finish")}
        />
      }
    >
      <FormField label={t("fabExplorer.addEmployee")}>
        <div style={{ display: "flex", columnGap: "8px" }}>
          <Input
            value={newEmployee}
            onChange={(_, data) => setNewEmployee(data.value)}
            style={{ flexGrow: 1 }}
          />
          <Button appearance="primary" onClick={addEmployee}>
            {t("fabExplorer.addEmployee")}
          </Button>
        </div>
      </FormField>
      <div className={styles.list}>
        {employees.map((e) => (
          <div key={e} className={styles.row}>
            <span>{e}</span>
            <Button appearance="secondary" size="small" onClick={() => removeEmployee(e)}>
              {t("fabExplorer.removeEmployee")}
            </Button>
          </div>
        ))}
      </div>
      <div style={{ fontSize: "12px", color: tokens.colorNeutralForeground3 }}>
        {t("fabExplorer.resources")}: {resources.length}
      </div>
    </BaseDialog>
  );
}
