import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import {
  Text,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface UnassignEmployeesDialogProps {
  open: boolean;
  onClose: () => void;
  qualificationName: string;
}

const EMPLOYEES = [
  { name: "Matthew Krazovitz", number: "10225" },
  { name: "John Doe", number: "10226" },
];

export function UnassignEmployeesDialog({
  open,
  onClose,
  qualificationName,
}: UnassignEmployeesDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.qualification.dialogs.unassign";
  const [selected, setSelected] = useState<string[]>(["10225"]);

  const toggle = (number: string) => {
    setSelected((prev) =>
      prev.includes(number) ? prev.filter((n) => n !== number) : [...prev, number],
    );
  };

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      size="lg"
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onClose}
          confirmLabel={t(`${k}.unassign`)}
          disabled={selected.length === 0}
        />
      }
    >
      <Text style={{ marginBottom: 12 }}>{t(`${k}.message`, { name: qualificationName })}</Text>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell />
            <TableHeaderCell>{t(`${k}.employee`)}</TableHeaderCell>
            <TableHeaderCell>{t(`${k}.employeeNumber`)}</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {EMPLOYEES.map((e) => (
            <TableRow key={e.number}>
              <TableCell>
                <Checkbox checked={selected.includes(e.number)} onChange={() => toggle(e.number)} />
              </TableCell>
              <TableCell>{e.name}</TableCell>
              <TableCell>{e.number}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </BaseDialog>
  );
}
