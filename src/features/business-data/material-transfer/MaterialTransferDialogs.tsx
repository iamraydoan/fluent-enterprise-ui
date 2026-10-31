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

function LifecycleDialog({ open, onClose, onSubmit, opKey }: DialogProps & { opKey: string }) {
  const { t } = useAppTranslation();
  const P = `businessData.materialTransfer.operations.${opKey}`;
  const [comment, setComment] = useState("");

  const handleClose = () => {
    setComment("");
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
      <Text size={300}>{t(`${P}.confirmText` as never)}</Text>
      <div style={{ marginTop: "16px" }}>
        <Field label={t(`${P}.fields.comment` as never)}>
          <Input value={comment} onChange={(_, d) => setComment(d.value)} />
        </Field>
      </div>
    </BaseDialog>
  );
}

export function ApproveMaterialTransferDialog(props: DialogProps) {
  const opKey = "approve";
  return <LifecycleDialog {...props} opKey={opKey} />;
}

export function CancelMaterialTransferDialog(props: DialogProps) {
  const opKey = "cancel";
  return <LifecycleDialog {...props} opKey={opKey} />;
}

export function DeliverMaterialTransferDialog(props: DialogProps) {
  const opKey = "deliver";
  return <LifecycleDialog {...props} opKey={opKey} />;
}

export function PrepareMaterialTransferDialog(props: DialogProps) {
  const opKey = "prepare";
  return <LifecycleDialog {...props} opKey={opKey} />;
}

export function ReceiveMaterialTransferDialog(props: DialogProps) {
  const opKey = "receive";
  return <LifecycleDialog {...props} opKey={opKey} />;
}

export function RefuseMaterialTransferDialog(props: DialogProps) {
  const opKey = "refuse";
  return <LifecycleDialog {...props} opKey={opKey} />;
}

export function RejectMaterialTransferDialog(props: DialogProps) {
  const opKey = "reject";
  return <LifecycleDialog {...props} opKey={opKey} />;
}

export function SendMaterialTransferDialog(props: DialogProps) {
  const opKey = "send";
  return <LifecycleDialog {...props} opKey={opKey} />;
}

export function SpecialApproveMaterialTransferDialog(props: DialogProps) {
  const opKey = "specialApprove";
  return <LifecycleDialog {...props} opKey={opKey} />;
}

export function SpecialDeliverMaterialTransferDialog(props: DialogProps) {
  const opKey = "specialDeliver";
  return <LifecycleDialog {...props} opKey={opKey} />;
}

export function SpecialReceiveMaterialTransferDialog(props: DialogProps) {
  const opKey = "specialReceive";
  return <LifecycleDialog {...props} opKey={opKey} />;
}

export function SpecialSendMaterialTransferDialog(props: DialogProps) {
  const opKey = "specialSend";
  return <LifecycleDialog {...props} opKey={opKey} />;
}

export function ChangeMaterialTransferInfoDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.materialTransfer.operations.changeInfo";
  const [comment, setComment] = useState("");

  const handleClose = () => {
    setComment("");
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
      <Field label={t(`${P}.fields.comment` as never)}>
        <Input value={comment} onChange={(_, d) => setComment(d.value)} />
      </Field>
    </BaseDialog>
  );
}

export function RequestMaterialTransferDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.materialTransfer.operations.request";
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleClose = () => {
    setProduct("");
    setQuantity("");
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
            disabled={!product}
          >
            {t(`${P}.submit` as never)}
          </Button>
        </>
      }
    >
      <Field label={t(`${P}.fields.product` as never)} required>
        <Input value={product} onChange={(_, d) => setProduct(d.value)} />
      </Field>
      <Field label={t(`${P}.fields.quantity` as never)}>
        <Input value={quantity} onChange={(_, d) => setQuantity(d.value)} />
      </Field>
    </BaseDialog>
  );
}

export function RequestForMAODialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.materialTransfer.operations.requestForMAO";
  return (
    <BaseDialog size="lg"
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
    </BaseDialog>
  );
}

export function RequestForCostCenterDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.materialTransfer.operations.requestForCostCenter";
  return (
    <BaseDialog size="lg"
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
    </BaseDialog>
  );
}

export function ReturnInventoryDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.materialTransfer.operations.returnInventory";
  return (
    <BaseDialog size="lg"
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
    </BaseDialog>
  );
}

export function ReturnMaterialDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.materialTransfer.operations.returnMaterial";
  return (
    <BaseDialog size="lg"
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
    </BaseDialog>
  );
}

export function SpecialRequestForMaterialDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.materialTransfer.operations.specialRequest";
  return (
    <BaseDialog size="lg"
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
    </BaseDialog>
  );
}
