import { useState } from "react";
import { BaseDialog, DialogFooter, FormField } from "@/components/common";
import { Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

export function CheckInEmployeeDialog({
  open,
  resource,
  onClose,
  onConfirm,
}: {
  open: boolean;
  resource: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { t } = useAppTranslation();
  const [employee, setEmployee] = useState("");
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.checkInEmployee.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.checkInEmployee")}
          disabled={employee.trim() === ""}
        />
      }
    >
      <FormField label={t("manufacturing.fabExplorer.dialogs.checkInEmployee.resource")}>
        <Input value={resource} disabled />
      </FormField>
      <FormField label={t("manufacturing.fabExplorer.dialogs.checkInEmployee.employee")}>
        <Input value={employee} onChange={(_, d) => setEmployee(d.value)} />
      </FormField>
    </BaseDialog>
  );
}

export function CheckOutEmployeeDialog({
  open,
  resource,
  onClose,
  onConfirm,
}: {
  open: boolean;
  resource: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { t } = useAppTranslation();
  const [employee, setEmployee] = useState("");
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.checkOutEmployee.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel={t("manufacturing.fabExplorer.operations.checkOutEmployee")}
          disabled={employee.trim() === ""}
        />
      }
    >
      <div>
        {t("manufacturing.fabExplorer.dialogs.checkOutEmployee.message", {
          employee: employee || "—",
          resource,
        })}
      </div>
      <FormField label={t("manufacturing.fabExplorer.dialogs.checkOutEmployee.employee")}>
        <Input value={employee} onChange={(_, d) => setEmployee(d.value)} />
      </FormField>
    </BaseDialog>
  );
}
