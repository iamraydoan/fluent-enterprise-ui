import { useState } from "react";
import { Dismiss16Regular } from "@/components/icons";
import {
  Button,
  Input,
  Text,
  makeStyles,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { cardSurface } from "@/styles/shared";

const useDialogStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "24px",
    boxSizing: "border-box",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  surface: {
    ...cardSurface,
    width: "min(720px, 100%)",
    maxHeight: "calc(100vh - 48px)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  body: { padding: "20px", overflowY: "auto", flex: 1 },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "16px 20px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
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

function DialogShell({
  open,
  onClose,
  title,
  children,
  footer,
}: DialogProps & {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.surface}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={styles.header}>
          <Text size={400} weight="semibold">{title}</Text>
          <Button
            appearance="subtle"
            icon={<Dismiss16Regular />}
            onClick={onClose}
            aria-label={t("businessData.printableDocument.operations._shared.close" as never)}
          />
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
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
    setName(""); setDescription(""); setChangeSet("");
    onClose();
  };

  return (
    <DialogShell
      open={open}
      onClose={handleClose}
      title={t(`${P}.title` as never)}
      footer={
        <>
          <Button onClick={handleClose}>{t(`${P}.cancel` as never)}</Button>
          <Button
            appearance="primary"
            onClick={() => { onSubmit?.(); handleClose(); }}
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
    </DialogShell>
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
    <DialogShell
      open={open}
      onClose={handleClose}
      title={t(`${P}.title` as never)}
      footer={
        <>
          <Button onClick={handleClose}>{t(`${P}.cancel` as never)}</Button>
          <Button appearance="primary" onClick={() => { onSubmit?.(); handleClose(); }}>
            {t(`${P}.submit` as never)}
          </Button>
        </>
      }
    >
      <Field label={t(`${P}.fields.name` as never)} hint={t(`${P}.hints.nameLocked` as never)}>
        <Input value={initialName ?? ""} disabled />
      </Field>
      <Field label={t(`${P}.fields.description` as never)}>
        <Input value={description} onChange={(_, d) => setDescription(d.value)} />
      </Field>
    </DialogShell>
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
    <DialogShell
      open={open}
      onClose={handleClose}
      title={t(`${P}.title` as never)}
      footer={
        <>
          <Button onClick={handleClose}>{t(`${P}.cancel` as never)}</Button>
          <Button appearance="primary" onClick={() => { onSubmit?.(); handleClose(); }}>
            {t(`${P}.submit` as never)}
          </Button>
        </>
      }
    >
      <Field label={t(`${P}.fields.name` as never)} hint={t(`${P}.hints.nameGenerator` as never)}>
        <Input value={name} onChange={(_, d) => setName(d.value)} />
      </Field>
    </DialogShell>
  );
}

export function TerminatePrintableDocumentDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.printableDocument.operations.terminate";
  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title={t(`${P}.title` as never)}
      footer={
        <>
          <Button onClick={onClose}>{t(`${P}.cancel` as never)}</Button>
          <Button appearance="primary" onClick={() => { onSubmit?.(); onClose(); }}>
            {t(`${P}.submit` as never)}
          </Button>
        </>
      }
    >
      <Text size={300}>{t(`${P}.confirmText` as never)}</Text>
    </DialogShell>
  );
}

export function UnterminatePrintableDocumentDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.printableDocument.operations.unterminate";
  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title={t(`${P}.title` as never)}
      footer={
        <>
          <Button onClick={onClose}>{t(`${P}.cancel` as never)}</Button>
          <Button appearance="primary" onClick={() => { onSubmit?.(); onClose(); }}>
            {t(`${P}.submit` as never)}
          </Button>
        </>
      }
    >
      <Text size={300}>{t(`${P}.confirmText` as never)}</Text>
    </DialogShell>
  );
}

export function PrintPrintableDocumentDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.printableDocument.operations.print";
  const [printer, setPrinter] = useState("");
  const [copies, setCopies] = useState("1");

  const handleClose = () => {
    setPrinter(""); setCopies("1");
    onClose();
  };

  return (
    <DialogShell
      open={open}
      onClose={handleClose}
      title={t(`${P}.title` as never)}
      footer={
        <>
          <Button onClick={handleClose}>{t(`${P}.cancel` as never)}</Button>
          <Button appearance="primary" onClick={() => { onSubmit?.(); handleClose(); }}>
            {t(`${P}.submit` as never)}
          </Button>
        </>
      }
    >
      <Field label={t(`${P}.fields.printer` as never)} required>
        <Input value={printer} onChange={(_, d) => setPrinter(d.value)} />
      </Field>
      <Field label={t(`${P}.fields.copies` as never)}>
        <Input value={copies} onChange={(_, d) => setCopies(d.value)} />
      </Field>
    </DialogShell>
  );
}

export function LayoutCreationDialog({ open, onClose }: Omit<DialogProps, "onSubmit">) {
  const { t } = useAppTranslation();
  const P = "businessData.printableDocument.operations.layoutCreation";
  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title={t(`${P}.title` as never)}
      footer={<Button onClick={onClose}>{t(`${P}.close` as never)}</Button>}
    >
      <Text size={300}>{t(`${P}.description` as never)}</Text>
    </DialogShell>
  );
}

export function LotTravelerDialog({ open, onClose }: Omit<DialogProps, "onSubmit">) {
  const { t } = useAppTranslation();
  const P = "businessData.printableDocument.operations.lotTraveler";
  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title={t(`${P}.title` as never)}
      footer={<Button onClick={onClose}>{t(`${P}.close` as never)}</Button>}
    >
      <Text size={300}>{t(`${P}.description` as never)}</Text>
    </DialogShell>
  );
}

export function PrintersDialog({ open, onClose }: Omit<DialogProps, "onSubmit">) {
  const { t } = useAppTranslation();
  const P = "businessData.printableDocument.operations.printers";
  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title={t(`${P}.title` as never)}
      footer={<Button onClick={onClose}>{t(`${P}.close` as never)}</Button>}
    >
      <Text size={300}>{t(`${P}.description` as never)}</Text>
    </DialogShell>
  );
}
