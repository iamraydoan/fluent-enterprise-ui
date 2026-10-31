import { useState } from "react";
import { BaseDialog } from "@/components/common";
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
    <BaseDialog size="lg"
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
    </BaseDialog>
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
    </BaseDialog>
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
          >
            {t(`${P}.submit` as never)}
          </Button>
        </>
      }
    >
      <Field label={t(`${P}.fields.name` as never)} hint={t(`${P}.hints.nameGenerator` as never)}>
        <Input value={name} onChange={(_, d) => setName(d.value)} />
      </Field>
    </BaseDialog>
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
