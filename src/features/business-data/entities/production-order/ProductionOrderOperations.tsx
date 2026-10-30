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
            aria-label={t("businessData.productionOrder.operations._shared.close" as never)}
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

function StateDialog({
  open,
  onClose,
  onSubmit,
  opKey,
}: DialogProps & { opKey: string }) {
  const { t } = useAppTranslation();
  const P = `businessData.productionOrder.operations.${opKey}`;
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

export function CreateProductionOrderDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.productionOrder.operations.create";
  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleClose = () => {
    setName(""); setProduct(""); setQuantity("");
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
      <Field label={t(`${P}.fields.product` as never)} required>
        <Input value={product} onChange={(_, d) => setProduct(d.value)} />
      </Field>
      <Field label={t(`${P}.fields.quantity` as never)} required>
        <Input value={quantity} onChange={(_, d) => setQuantity(d.value)} />
      </Field>
    </DialogShell>
  );
}

export function EditProductionOrderDialog({
  open,
  onClose,
  onSubmit,
  initialName,
}: DialogProps & { initialName?: string }) {
  const { t } = useAppTranslation();
  const P = "businessData.productionOrder.operations.edit";
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

export function CloneProductionOrderDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.productionOrder.operations.clone";
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

export function TerminateProductionOrderDialog(props: DialogProps) {
  const opKey = "terminate";
  return <StateDialog {...props} opKey={opKey} />;
}

export function UnterminateProductionOrderDialog(props: DialogProps) {
  const opKey = "unterminate";
  return <StateDialog {...props} opKey={opKey} />;
}

export function ReleaseProductionOrderDialog(props: DialogProps) {
  const opKey = "release";
  return <StateDialog {...props} opKey={opKey} />;
}

export function UnreleaseProductionOrderDialog(props: DialogProps) {
  const opKey = "unrelease";
  return <StateDialog {...props} opKey={opKey} />;
}

export function StartProductionOrderDialog(props: DialogProps) {
  const opKey = "start";
  return <StateDialog {...props} opKey={opKey} />;
}

export function CancelProductionOrderDialog(props: DialogProps) {
  const opKey = "cancel";
  return <StateDialog {...props} opKey={opKey} />;
}

export function CloseProductionOrderDialog(props: DialogProps) {
  const opKey = "close";
  return <StateDialog {...props} opKey={opKey} />;
}

export function ReopenProductionOrderDialog(props: DialogProps) {
  const opKey = "reopen";
  return <StateDialog {...props} opKey={opKey} />;
}

export function RestrictProductionOrderDialog(props: DialogProps) {
  const opKey = "restrict";
  return <StateDialog {...props} opKey={opKey} />;
}

export function UnrestrictProductionOrderDialog(props: DialogProps) {
  const opKey = "unrestrict";
  return <StateDialog {...props} opKey={opKey} />;
}

export function AssignMaterialsDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.productionOrder.operations.assignMaterials";
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
      <Text size={300}>{t(`${P}.description` as never)}</Text>
    </DialogShell>
  );
}

export function ReassignMaterialsDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.productionOrder.operations.reassignMaterials";
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
      <Text size={300}>{t(`${P}.description` as never)}</Text>
    </DialogShell>
  );
}

export function CreateMaterialForOrderDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.productionOrder.operations.createMaterial";
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
      <Text size={300}>{t(`${P}.description` as never)}</Text>
    </DialogShell>
  );
}

export function ChangeProductQuantityDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.productionOrder.operations.changeProductQuantity";
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleClose = () => {
    setProduct(""); setQuantity("");
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
      <Field label={t(`${P}.fields.product` as never)}>
        <Input value={product} onChange={(_, d) => setProduct(d.value)} />
      </Field>
      <Field label={t(`${P}.fields.quantity` as never)}>
        <Input value={quantity} onChange={(_, d) => setQuantity(d.value)} />
      </Field>
    </DialogShell>
  );
}

export function ManageStepsDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.productionOrder.operations.manageSteps";
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
      <Text size={300}>{t(`${P}.description` as never)}</Text>
    </DialogShell>
  );
}

export function SynchronizeStepsDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.productionOrder.operations.synchronizeSteps";
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
      <Text size={300}>{t(`${P}.description` as never)}</Text>
    </DialogShell>
  );
}
