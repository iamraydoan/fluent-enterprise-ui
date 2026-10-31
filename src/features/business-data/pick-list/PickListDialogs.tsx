import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Button, Input, Text, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const useDialogStyles = makeStyles({
  field: { marginBottom: "16px" },
  label: { display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" },
  hint: { fontSize: "12px", color: tokens.colorNeutralForeground3, marginTop: "4px" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
    marginTop: "12px",
  },
  th: {
    textAlign: "left",
    padding: "8px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontWeight: 600,
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: tokens.colorNeutralForeground3,
  },
  td: {
    padding: "8px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const styles = useDialogStyles();
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  );
}

export function EditPickListDialog({
  open,
  onClose,
  onSubmit,
  initialName,
}: DialogProps & { initialName?: string }) {
  const { t } = useAppTranslation();
  const P = "businessData.pickList.operations.edit";
  const [description, setDescription] = useState("");

  const handleClose = () => {
    setDescription("");
    onClose();
  };

  return (
    <BaseDialog size="xl"
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

export function ManagePickListItemsDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const P = "businessData.pickList.operations.manageItems";

  return (
    <BaseDialog size="xl"
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
      <Text size={300}>{t(`${P}.description` as never)}</Text>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>{t(`${P}.columns.material` as never)}</th>
            <th className={styles.th}>{t(`${P}.columns.quantity` as never)}</th>
            <th className={styles.th}>{t(`${P}.columns.picked` as never)}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.td} colSpan={3}>
              <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                {t(`${P}.empty` as never)}
              </Text>
            </td>
          </tr>
        </tbody>
      </table>
      <div className={styles.hint} style={{ marginTop: "12px" }}>
        {t(`${P}.warning` as never)}
      </div>
    </BaseDialog>
  );
}

export function PickPickListDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const P = "businessData.pickList.operations.pick";

  return (
    <BaseDialog size="xl"
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
      <Text size={300}>{t(`${P}.description` as never)}</Text>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>{t(`${P}.columns.item` as never)}</th>
            <th className={styles.th}>{t(`${P}.columns.status` as never)}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.td} colSpan={2}>
              <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                {t(`${P}.empty` as never)}
              </Text>
            </td>
          </tr>
        </tbody>
      </table>
    </BaseDialog>
  );
}

export function TakePickListOwnershipDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.pickList.operations.takeOwnership";
  return (
    <BaseDialog size="xl"
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

export function UnpickPickListItemsDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.pickList.operations.unpick";
  return (
    <BaseDialog size="xl"
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

export function PickListReportDialog({ open, onClose }: Omit<DialogProps, "onSubmit">) {
  const { t } = useAppTranslation();
  const P = "businessData.pickList.operations.viewReport";
  return (
    <BaseDialog size="xl"
      open={open}
      onClose={onClose}
      title={t(`${P}.title` as never)}
      footer={<Button onClick={onClose}>{t(`${P}.close` as never)}</Button>}
    >
      <Text size={300}>{t(`${P}.description` as never)}</Text>
    </BaseDialog>
  );
}
