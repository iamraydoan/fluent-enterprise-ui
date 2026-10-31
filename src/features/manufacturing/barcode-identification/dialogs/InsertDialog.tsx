import { useEffect, useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const L: Record<string, TranslationKey> = {
  title: "manufacturing.barcodeIdentification.insert.title",
  placeholder: "manufacturing.barcodeIdentification.insert.placeholder",
  ok: "manufacturing.barcodeIdentification.insert.ok",
  cancel: "common.cancel",
};

interface InsertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (code: string) => void;
}

export function InsertDialog({ open, onClose, onConfirm }: InsertDialogProps) {
  const { t } = useAppTranslation();
  const [code, setCode] = useState("");

  useEffect(() => {
    if (open) setCode("");
  }, [open]);

  const trimmed = code.trim();

  return (
    <BaseDialog
      open={open}
      title={t(L.title)}
      size="md"
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={() => onConfirm(trimmed)}
          confirmLabel={t(L.ok)}
          cancelLabel={t(L.cancel)}
          disabled={trimmed === ""}
        />
      }
    >
      <Input
        value={code}
        onChange={(_, data) => setCode(data.value)}
        placeholder={t(L.placeholder)}
        aria-label={t(L.placeholder)}
        autoFocus
        onKeyDown={(event) => {
          if (event.key === "Enter" && trimmed !== "") onConfirm(trimmed);
        }}
      />
    </BaseDialog>
  );
}
