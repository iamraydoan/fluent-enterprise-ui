import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import {
  Body1Strong,
  Checkbox,
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

export function UploadRecipeToResourceDialog({
  open,
  onClose,
  recipeName,
}: UploadRecipeToResourceDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.recipe.dialogs.upload";
  const [selected, setSelected] = useState<string[]>(["Oven-01"]);
  const [comments, setComments] = useState("");

  const toggle = (name: string) => {
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  };

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(1000px, 92vw)"
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onClose}
          confirmLabel={t(`${k}.upload`)}
          disabled={selected.length === 0}
        />
      }
    >
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
    </BaseDialog>
  );
}
