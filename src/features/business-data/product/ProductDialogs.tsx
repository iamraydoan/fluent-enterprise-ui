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
    width: "min(900px, 100%)",
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
          <Text size={400} weight="semibold">
            {title}
          </Text>
          <Button
            appearance="subtle"
            icon={<Dismiss16Regular />}
            onClick={onClose}
            aria-label={t("businessData.product.operations._shared.close" as never)}
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

function ManageDialog({ open, onClose, onSubmit, opKey }: DialogProps & { opKey: string }) {
  const { t } = useAppTranslation();
  const P = `businessData.product.operations.${opKey}`;
  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title={t(`${P}.title` as never)}
      footer={
        <>
          <Button onClick={onClose}>{t(`${P}.cancel` as never)}</Button>
          <Button
            appearance="primary"
            onClick={() => {
              onSubmit?.();
              onClose();
            }}
          >
            {t(`${P}.submit` as never)}
          </Button>
        </>
      }
    >
      <Text size={300}>{t(`${P}.description` as never)}</Text>
    </DialogShell>
  );
}

export function CreateProductDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.product.operations.create";
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

export function EditProductDialog({
  open,
  onClose,
  onSubmit,
  initialName,
}: DialogProps & { initialName?: string }) {
  const { t } = useAppTranslation();
  const P = "businessData.product.operations.edit";
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

export function CloneProductDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.product.operations.clone";
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

export function TerminateProductDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.product.operations.terminate";
  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title={t(`${P}.title` as never)}
      footer={
        <>
          <Button onClick={onClose}>{t(`${P}.cancel` as never)}</Button>
          <Button
            appearance="primary"
            onClick={() => {
              onSubmit?.();
              onClose();
            }}
          >
            {t(`${P}.submit` as never)}
          </Button>
        </>
      }
    >
      <Text size={300}>{t(`${P}.confirmText` as never)}</Text>
    </DialogShell>
  );
}

export function UnterminateProductDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.product.operations.unterminate";
  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title={t(`${P}.title` as never)}
      footer={
        <>
          <Button onClick={onClose}>{t(`${P}.cancel` as never)}</Button>
          <Button
            appearance="primary"
            onClick={() => {
              onSubmit?.();
              onClose();
            }}
          >
            {t(`${P}.submit` as never)}
          </Button>
        </>
      }
    >
      <Text size={300}>{t(`${P}.confirmText` as never)}</Text>
    </DialogShell>
  );
}

export function CreateBOMForProductDialog(props: DialogProps) {
  const opKey = "createBOM";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function ImportProductInfoDialog(props: DialogProps) {
  const opKey = "importInfo";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function ManageBinningTreeDialog(props: DialogProps) {
  const opKey = "manageBinningTree";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function ManageCharacteristicsDialog(props: DialogProps) {
  const opKey = "manageCharacteristics";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function ManageCostsDialog(props: DialogProps) {
  const opKey = "manageCosts";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function ManageMaterialLogisticsDialog(props: DialogProps) {
  const opKey = "manageLogistics";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function ManageProductParametersDialog(props: DialogProps) {
  const opKey = "manageParameters";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function ManagePlanningDialog(props: DialogProps) {
  const opKey = "managePlanning";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function ManageComponentInfoDialog(props: DialogProps) {
  const opKey = "manageComponentInfo";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function ManageManufacturersDialog(props: DialogProps) {
  const opKey = "manageManufacturers";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function ManageRepairPolicyDialog(props: DialogProps) {
  const opKey = "manageRepairPolicy";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function ManageRulesDialog(props: DialogProps) {
  const opKey = "manageRules";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function ManageSafetyInfoDialog(props: DialogProps) {
  const opKey = "manageSafetyInfo";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function ManageSchedulingDialog(props: DialogProps) {
  const opKey = "manageScheduling";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function ManageSubProductsDialog(props: DialogProps) {
  const opKey = "manageSubProducts";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function ManageTransferInfoDialog(props: DialogProps) {
  const opKey = "manageTransferInfo";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function ManageUnitConversionDialog(props: DialogProps) {
  const opKey = "manageUnitConversion";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function PreviewRulesDialog(props: DialogProps) {
  const opKey = "previewRules";
  return <ManageDialog {...props} opKey={opKey} />;
}

export function ViewProductReportsDialog({ open, onClose }: Omit<DialogProps, "onSubmit">) {
  const { t } = useAppTranslation();
  const P = "businessData.product.operations.viewReports";
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
