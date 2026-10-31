import { useState } from "react";
import { Dismiss16Regular } from "@/components/icons";
import { Button, Input, Text, makeStyles, tokens } from "@/components/ui";
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
  wide,
}: DialogProps & {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.surface}
        style={wide ? { width: "min(1000px, 100%)" } : undefined}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={styles.header}>
          <Text size={400} weight="semibold">
            {title}
          </Text>
          <Button
            appearance="subtle"
            icon={<Dismiss16Regular />}
            onClick={onClose}
            aria-label={t("businessData.periodicInventory.operations._shared.close" as never)}
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

function ConfirmDialog({
  open,
  onClose,
  onSubmit,
  title,
  confirmText,
  submitLabel,
}: DialogProps & { title: string; confirmText: string; submitLabel: string }) {
  const { t } = useAppTranslation();
  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button onClick={onClose}>
            {t("businessData.periodicInventory.operations._shared.cancel" as never)}
          </Button>
          <Button
            appearance="primary"
            onClick={() => {
              onSubmit?.();
              onClose();
            }}
          >
            {submitLabel}
          </Button>
        </>
      }
    >
      <Text size={300}>{confirmText}</Text>
    </DialogShell>
  );
}


export function EditPeriodicInventoryDialog({
  open,
  onClose,
  onSubmit,
  initialName,
}: DialogProps & { initialName?: string }) {
  const { t } = useAppTranslation();
  const P = "businessData.periodicInventory.operations.edit";
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
          <Button
            appearance="primary"
            onClick={() => {
              onSubmit?.();
              handleClose();
            }}
          >
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

export function ClonePeriodicInventoryDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.periodicInventory.operations.clone";
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
          <Button
            appearance="primary"
            onClick={() => {
              onSubmit?.();
              handleClose();
            }}
          >
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

export function TerminatePeriodicInventoryDialog(props: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.periodicInventory.operations.terminate";
  return (
    <ConfirmDialog
      {...props}
      title={t(`${P}.title` as never)}
      confirmText={t(`${P}.confirmText` as never)}
      submitLabel={t(`${P}.submit` as never)}
    />
  );
}

export function UnterminatePeriodicInventoryDialog(props: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.periodicInventory.operations.unterminate";
  return (
    <ConfirmDialog
      {...props}
      title={t(`${P}.title` as never)}
      confirmText={t(`${P}.confirmText` as never)}
      submitLabel={t(`${P}.submit` as never)}
    />
  );
}

export function BeginPeriodicInventoryDialog(props: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.periodicInventory.operations.begin";
  return (
    <ConfirmDialog
      {...props}
      title={t(`${P}.title` as never)}
      confirmText={t(`${P}.confirmText` as never)}
      submitLabel={t(`${P}.submit` as never)}
    />
  );
}

export function CancelPeriodicInventoryDialog(props: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.periodicInventory.operations.cancel";
  return (
    <ConfirmDialog
      {...props}
      title={t(`${P}.title` as never)}
      confirmText={t(`${P}.confirmText` as never)}
      submitLabel={t(`${P}.submit` as never)}
    />
  );
}

export function CompletePeriodicInventoryDialog(props: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.periodicInventory.operations.complete";
  return (
    <ConfirmDialog
      {...props}
      title={t(`${P}.title` as never)}
      confirmText={t(`${P}.confirmText` as never)}
      submitLabel={t(`${P}.submit` as never)}
    />
  );
}

export function PerformPeriodicInventoryDialog(props: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.periodicInventory.operations.perform";
  return (
    <ConfirmDialog
      {...props}
      title={t(`${P}.title` as never)}
      confirmText={t(`${P}.confirmText` as never)}
      submitLabel={t(`${P}.submit` as never)}
    />
  );
}

export function TakeOwnershipPeriodicInventoryDialog(props: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.periodicInventory.operations.takeOwnership";
  return (
    <ConfirmDialog
      {...props}
      title={t(`${P}.title` as never)}
      confirmText={t(`${P}.confirmText` as never)}
      submitLabel={t(`${P}.submit` as never)}
    />
  );
}

export function PeriodicInventoryReportDialog({ open, onClose }: Omit<DialogProps, "onSubmit">) {
  const { t } = useAppTranslation();
  const P = "businessData.periodicInventory.operations.viewReport";
  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title={t(`${P}.title` as never)}
      wide
      footer={<Button onClick={onClose}>{t(`${P}.close` as never)}</Button>}
    >
      <Text size={300}>{t(`${P}.description` as never)}</Text>
    </DialogShell>
  );
}
