import { useState } from "react";
import {
  Body1Strong,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface UploadRecipeToResourceDialogProps {
  open: boolean;
  onClose: () => void;
  recipeName: string;
}

const RESOURCES = [
  { name: "Oven-01", lastUploadDate: "10/28/2026 09:15:00 AM" },
  { name: "Oven-02", lastUploadDate: "" },
];

export function UploadRecipeToResourceDialog({ open, onClose, recipeName }: UploadRecipeToResourceDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.recipe.dialogs.upload";
  const [selected, setSelected] = useState<string[]>(["Oven-01"]);
  const [comments, setComments] = useState("");

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 1000, width: "92vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🎛 {recipeName}</div>
            <Body1Strong>{t(`${k}.resources`)}</Body1Strong>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell />
                  <TableHeaderCell>{t(`${k}.resource`)}</TableHeaderCell>
                  <TableHeaderCell>{t(`${k}.lastUploadDate`)}</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RESOURCES.map((r) => (
                  <TableRow key={r.name}>
                    <TableCell>
                      <Checkbox checked={selected.includes(r.name)} onChange={() => toggle(r.name)} />
                    </TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.lastUploadDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Field label={t(`${k}.comments`)}>
              <Input value={comments} onChange={(_, d) => setComments(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>{t("common.cancel")}</Button>
            <Button appearance="primary" onClick={onClose} disabled={selected.length === 0}>
              {t(`${k}.upload`)}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
