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
            aria-label={t("businessData.material.operations._shared.close" as never)}
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

function OpDialog({
  open,
  onClose,
  onSubmit,
  opKey,
}: DialogProps & { opKey: string }) {
  const { t } = useAppTranslation();
  const P = `businessData.material.operations.${opKey}`;
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

export function CreateMaterialDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.material.operations.create";
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
            disabled={!product}
          >
            {t(`${P}.submit` as never)}
          </Button>
        </>
      }
    >
      <Field label={t(`${P}.fields.name` as never)} hint={t(`${P}.hints.nameGenerator` as never)}>
        <Input value={name} onChange={(_, d) => setName(d.value)} />
      </Field>
      <Field label={t(`${P}.fields.product` as never)} required>
        <Input value={product} onChange={(_, d) => setProduct(d.value)} />
      </Field>
      <Field label={t(`${P}.fields.quantity` as never)}>
        <Input value={quantity} onChange={(_, d) => setQuantity(d.value)} />
      </Field>
    </DialogShell>
  );
}

export function EditMaterialDialog({
  open,
  onClose,
  onSubmit,
  initialName,
}: DialogProps & { initialName?: string }) {
  const { t } = useAppTranslation();
  const P = "businessData.material.operations.edit";
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

export function CloneMaterialDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.material.operations.clone";
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

export function TerminateMaterialDialog(props: DialogProps) {
  const opKey = "terminate";
  return <OpDialog {...props} opKey={opKey} />;
}

export function UnterminateMaterialDialog(props: DialogProps) {
  const opKey = "unterminate";
  return <OpDialog {...props} opKey={opKey} />;
}

export function DispatchMaterialDialog(props: DialogProps) {
  const opKey = "dispatch";
  return <OpDialog {...props} opKey={opKey} />;
}

export function UndispatchMaterialDialog(props: DialogProps) {
  const opKey = "undispatch";
  return <OpDialog {...props} opKey={opKey} />;
}

export function TrackInMaterialDialog(props: DialogProps) {
  const opKey = "trackIn";
  return <OpDialog {...props} opKey={opKey} />;
}

export function TrackOutMaterialDialog(props: DialogProps) {
  const opKey = "trackOut";
  return <OpDialog {...props} opKey={opKey} />;
}

export function MoveNextMaterialDialog(props: DialogProps) {
  const opKey = "moveNext";
  return <OpDialog {...props} opKey={opKey} />;
}

export function AbortMaterialDialog(props: DialogProps) {
  const opKey = "abort";
  return <OpDialog {...props} opKey={opKey} />;
}

export function ShipMaterialDialog(props: DialogProps) {
  const opKey = "ship";
  return <OpDialog {...props} opKey={opKey} />;
}

export function ReceiveMaterialDialog(props: DialogProps) {
  const opKey = "receive";
  return <OpDialog {...props} opKey={opKey} />;
}

export function UnshipMaterialDialog(props: DialogProps) {
  const opKey = "unship";
  return <OpDialog {...props} opKey={opKey} />;
}

export function HoldMaterialDialog(props: DialogProps) {
  const opKey = "hold";
  return <OpDialog {...props} opKey={opKey} />;
}

export function SplitMaterialDialog(props: DialogProps) {
  const opKey = "split";
  return <OpDialog {...props} opKey={opKey} />;
}

export function MergeMaterialDialog(props: DialogProps) {
  const opKey = "merge";
  return <OpDialog {...props} opKey={opKey} />;
}

export function CombineMaterialDialog(props: DialogProps) {
  const opKey = "combine";
  return <OpDialog {...props} opKey={opKey} />;
}

export function AttachMaterialDialog(props: DialogProps) {
  const opKey = "attach";
  return <OpDialog {...props} opKey={opKey} />;
}

export function DetachMaterialDialog(props: DialogProps) {
  const opKey = "detach";
  return <OpDialog {...props} opKey={opKey} />;
}

export function GradeMaterialDialog(props: DialogProps) {
  const opKey = "grade";
  return <OpDialog {...props} opKey={opKey} />;
}

export function ReworkMaterialDialog(props: DialogProps) {
  const opKey = "rework";
  return <OpDialog {...props} opKey={opKey} />;
}

export function ChangeProductDialog(props: DialogProps) {
  const opKey = "changeProduct";
  return <OpDialog {...props} opKey={opKey} />;
}

export function ChangeQuantityDialog(props: DialogProps) {
  const opKey = "changeQuantity";
  return <OpDialog {...props} opKey={opKey} />;
}

export function ChangeFlowStepDialog(props: DialogProps) {
  const opKey = "changeFlowStep";
  return <OpDialog {...props} opKey={opKey} />;
}

export function ViewMaterialReportsDialog({ open, onClose }: Omit<DialogProps, "onSubmit">) {
  const { t } = useAppTranslation();
  const P = "businessData.material.operations.viewReports";
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

export function ViewMaterialDocumentsDialog({ open, onClose }: Omit<DialogProps, "onSubmit">) {
  const { t } = useAppTranslation();
  const P = "businessData.material.operations.viewDocuments";
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
