import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Button, Input, Text, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const useDialogStyles = makeStyles({
  field: { marginBottom: "16px" },
  label: { display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" },
  required: { color: tokens.colorPaletteRedForeground1, marginRight: "4px" },
  hint: { fontSize: "12px", color: tokens.colorNeutralForeground3, marginTop: "4px" },
});

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  const styles = useDialogStyles();
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {required && <span className={styles.required}>*</span>}
        {label}
      </label>
      {children}
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  );
}

export function CreatePrintableDocumentDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.printableDocument.operations.create";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [changeSet, setChangeSet] = useState("");

  const handleClose = () => {
    setName("");
    setDescription("");
    setChangeSet("");
    onClose();
  };

  return (
    <BaseDialog size="lg"
      open={open}
      onClose={handleClose}
      title={t(`${P}.title` as never)}
      footer={
        <>
          <Button onClick={handleClose}>{t(`${P}.cancel` as never)}</Button>
          <Button
            appearance="primary"
            onClick={() => {
              onSubmit?.();
              handleClose();
            }}
            disabled={!name}
          >
            {t(`${P}.submit` as never)}
          </Button>
        </>
      }
    >
      <Field label={t(`${P}.fields.name` as never)} required>
        <Input value={name} onChange={(_, d) => setName(d.value)} />
      </Field>
      <Field label={t(`${P}.fields.description` as never)}>
        <Input value={description} onChange={(_, d) => setDescription(d.value)} />
      </Field>
      <Field
        label={t(`${P}.fields.changeSet` as never)}
        required
        hint={t(`${P}.hints.changeSet` as never)}
      >
        <Input value={changeSet} onChange={(_, d) => setChangeSet(d.value)} />
      </Field>
    </BaseDialog>
  );
}

export function EditPrintableDocumentDialog({
  open,
  onClose,
  onSubmit,
  initialName,
}: DialogProps & { initialName?: string }) {
  const { t } = useAppTranslation();
  const P = "businessData.printableDocument.operations.edit";
  const [description, setDescription] = useState("");

  const handleClose = () => {
    setDescription("");
    onClose();
  };

  return (
    <BaseDialog size="lg"
      open={open}
      onClose={handleClose}
      title={t(`${P}.title` as never)}
      footer={
        <DialogFooter
          onCancel={handleClose}
          onConfirm={() => {
            onSubmit?.();
            handleClose();
          }}
          confirmLabel={t(`${P}.submit` as never)}
        />
      }
    >
      <Field label={t(`${P}.fields.name` as never)} hint={t(`${P}.hints.nameLocked` as never)}>
        <Input value={initialName ?? ""} disabled />
      </Field>
      <Field label={t(`${P}.fields.description` as never)}>
        <Input value={description} onChange={(_, d) => setDescription(d.value)} />
      </Field>
    </BaseDialog>
  );
}

export function ClonePrintableDocumentDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.printableDocument.operations.clone";
  const [name, setName] = useState("");

  const handleClose = () => {
    setName("");
    onClose();
  };

  return (
    <BaseDialog size="lg"
      open={open}
      onClose={handleClose}
      title={t(`${P}.title` as never)}
      footer={
        <DialogFooter
          onCancel={handleClose}
          onConfirm={() => {
            onSubmit?.();
            handleClose();
          }}
          confirmLabel={t(`${P}.submit` as never)}
        />
      }
    >
      <Field label={t(`${P}.fields.name` as never)} hint={t(`${P}.hints.nameGenerator` as never)}>
        <Input value={name} onChange={(_, d) => setName(d.value)} />
      </Field>
    </BaseDialog>
  );
}

export function TerminatePrintableDocumentDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.printableDocument.operations.terminate";
  return (
    <BaseDialog size="lg"
      open={open}
      onClose={onClose}
      title={t(`${P}.title` as never)}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={() => {
            onSubmit?.();
            onClose();
          }}
          confirmLabel={t(`${P}.submit` as never)}
        />
      }
    >
      <Text size={300}>{t(`${P}.confirmText` as never)}</Text>
    </BaseDialog>
  );
}

export function UnterminatePrintableDocumentDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.printableDocument.operations.unterminate";
  return (
    <BaseDialog size="lg"
      open={open}
      onClose={onClose}
      title={t(`${P}.title` as never)}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={() => {
            onSubmit?.();
            onClose();
          }}
          confirmLabel={t(`${P}.submit` as never)}
        />
      }
    >
      <Text size={300}>{t(`${P}.confirmText` as never)}</Text>
    </BaseDialog>
  );
}

export function PrintPrintableDocumentDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.printableDocument.operations.print";
  const [printer, setPrinter] = useState("");
  const [copies, setCopies] = useState("1");

  const handleClose = () => {
    setPrinter("");
    setCopies("1");
    onClose();
  };

  return (
    <BaseDialog size="lg"
      open={open}
      onClose={handleClose}
      title={t(`${P}.title` as never)}
      footer={
        <DialogFooter
          onCancel={handleClose}
          onConfirm={() => {
            onSubmit?.();
            handleClose();
          }}
          confirmLabel={t(`${P}.submit` as never)}
        />
      }
    >
      <Field label={t(`${P}.fields.printer` as never)} required>
        <Input value={printer} onChange={(_, d) => setPrinter(d.value)} />
      </Field>
      <Field label={t(`${P}.fields.copies` as never)}>
        <Input value={copies} onChange={(_, d) => setCopies(d.value)} />
      </Field>
    </BaseDialog>
  );
}

export function LayoutCreationDialog({ open, onClose }: Omit<DialogProps, "onSubmit">) {
  const { t } = useAppTranslation();
  const P = "businessData.printableDocument.operations.layoutCreation";
  return (
    <BaseDialog size="lg"
      open={open}
      onClose={onClose}
      title={t(`${P}.title` as never)}
      footer={<Button onClick={onClose}>{t(`${P}.close` as never)}</Button>}
    >
      <Text size={300}>{t(`${P}.description` as never)}</Text>
    </BaseDialog>
  );
}

export function LotTravelerDialog({ open, onClose }: Omit<DialogProps, "onSubmit">) {
  const { t } = useAppTranslation();
  const P = "businessData.printableDocument.operations.lotTraveler";
  return (
    <BaseDialog size="lg"
      open={open}
      onClose={onClose}
      title={t(`${P}.title` as never)}
      footer={<Button onClick={onClose}>{t(`${P}.close` as never)}</Button>}
    >
      <Text size={300}>{t(`${P}.description` as never)}</Text>
    </BaseDialog>
  );
}

export function PrintersDialog({ open, onClose }: Omit<DialogProps, "onSubmit">) {
  const { t } = useAppTranslation();
  const P = "businessData.printableDocument.operations.printers";
  return (
    <BaseDialog size="lg"
      open={open}
      onClose={onClose}
      title={t(`${P}.title` as never)}
      footer={<Button onClick={onClose}>{t(`${P}.close` as never)}</Button>}
    >
      <Text size={300}>{t(`${P}.description` as never)}</Text>
    </BaseDialog>
  );
}
