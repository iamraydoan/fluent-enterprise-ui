import { useState } from "react";
import {
  Text,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
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
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 700 }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <Text style={{ marginBottom: 12 }}>
              {t(`${k}.message`, { name: qualificationName })}
            </Text>
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
                      <Checkbox
                        checked={selected.includes(e.number)}
                        onChange={() => toggle(e.number)}
                      />
                    </TableCell>
                    <TableCell>{e.name}</TableCell>
                    <TableCell>{e.number}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button appearance="primary" onClick={onClose} disabled={selected.length === 0}>
              {t(`${k}.unassign`)}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
