import { useState } from "react";
import { useFabResources } from "@/api";
import { BaseDialog, DialogFooter, FormField, HStack, VStack } from "@/components/common";
import { Button, Input, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

const useDialogStyles = makeStyles({
  row: {
    padding: "8px 0",
    borderBottom: `1px solid ${theme.color.border}`,
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
        <HStack gap="8px">
          <Input value={newEmployee} onChange={setNewEmployee} style={{ flexGrow: 1 }} />
          <Button variant="primary" onClick={addEmployee}>
            {t("fabExplorer.addEmployee")}
          </Button>
        </HStack>
      </FormField>
      <VStack gap="8px">
        {employees.map((e) => (
          <HStack align="center" justify="space-between" key={e} className={styles.row}>
            <span>{e}</span>
            <Button variant="secondary" size="sm" onClick={() => removeEmployee(e)}>
              {t("fabExplorer.removeEmployee")}
            </Button>
          </HStack>
        ))}
      </VStack>
      <div style={{ fontSize: "12px", color: theme.color.textTertiary }}>
        {t("fabExplorer.resources")}: {resources.length}
      </div>
    </BaseDialog>
  );
}
