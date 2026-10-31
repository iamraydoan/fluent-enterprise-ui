import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Button, Input, Text, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const useDialogStyles = makeStyles({
  field: { marginBottom: "16px" },
  label: { display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" },
  required: { color: tokens.colorPaletteRedForeground1, marginRight: "4px" },
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

export function CreatePlanDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.plan.operations.create";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <BaseDialog
      size="xl"
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
    </BaseDialog>
  );
}

export function EditPlanDialog({
  open,
  onClose,
  onSubmit,
  initialName,
}: DialogProps & { initialName?: string }) {
  const { t } = useAppTranslation();
  const P = "businessData.plan.operations.edit";
  const [description, setDescription] = useState("");

  const handleClose = () => {
    setDescription("");
    onClose();
  };

  return (
    <BaseDialog
      size="xl"
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

export function ClonePlanDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.plan.operations.clone";
  const [name, setName] = useState("");

  const handleClose = () => {
    setName("");
    onClose();
  };

  return (
    <BaseDialog
      size="xl"
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

export function TerminatePlanDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.plan.operations.terminate";
  return (
    <BaseDialog
      size="xl"
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

export function AdjustPlanTargetsDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const P = "businessData.plan.operations.adjustTargets";

  return (
    <BaseDialog
      size="xl"
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
            <th className={styles.th}>{t(`${P}.columns.timeFrame` as never)}</th>
            <th className={styles.th}>{t(`${P}.columns.target` as never)}</th>
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
    </BaseDialog>
  );
}

export function ManagePlanItemsDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const P = "businessData.plan.operations.manageItems";

  return (
    <BaseDialog
      size="xl"
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
            <th className={styles.th}>{t(`${P}.columns.product` as never)}</th>
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

export function ManagePlanStepsDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const P = "businessData.plan.operations.manageSteps";

  return (
    <BaseDialog
      size="xl"
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
            <th className={styles.th}>{t(`${P}.columns.step` as never)}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.td}>
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

export function ManageExcludedMaterialTypesDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.plan.operations.manageExcludedTypes";

  return (
    <BaseDialog
      size="xl"
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
    </BaseDialog>
  );
}

export function CreatePlanScenarioDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.plan.operations.createScenario";
  const [name, setName] = useState("");

  const handleClose = () => {
    setName("");
    onClose();
  };

  return (
    <BaseDialog
      size="xl"
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
    </BaseDialog>
  );
}

export function ReleasePlanScenarioDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.plan.operations.releaseScenario";
  return (
    <BaseDialog
      size="xl"
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

export function SynchronizeScenarioDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.plan.operations.synchronizeScenario";
  return (
    <BaseDialog
      size="xl"
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
