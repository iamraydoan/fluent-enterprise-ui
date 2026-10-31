import { useState } from "react";
import { BaseDialog } from "@/components/common";
import { Button, Checkbox, Input, Text, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const useDialogStyles = makeStyles({
  field: { marginBottom: "16px" },
  label: { display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" },
  hint: { fontSize: "12px", color: tokens.colorNeutralForeground3, marginTop: "4px" },
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

export function TerminatePackageDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.package.operations.terminate";
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
      <Text size={300}>{t(`${P}.confirmText` as never)}</Text>
    </BaseDialog>
  );
}

export function UnterminatePackageDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.package.operations.unterminate";
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
      <Text size={300}>{t(`${P}.confirmText` as never)}</Text>
    </BaseDialog>
  );
}

export function ShipPackagesDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.package.operations.ship";
  const [facility, setFacility] = useState("");
  const [label, setLabel] = useState("");
  const [shipContainers, setShipContainers] = useState(true);
  const [comment, setComment] = useState("");

  const handleClose = () => {
    setFacility("");
    setLabel("");
    setShipContainers(true);
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
      <Field label={t(`${P}.fields.facility` as never)} hint={t(`${P}.hints.facility` as never)}>
        <Input value={facility} onChange={(_, d) => setFacility(d.value)} />
      </Field>
      <Field
        label={t(`${P}.fields.shippingLabel` as never)}
        hint={t(`${P}.hints.shippingLabel` as never)}
      >
        <Input value={label} onChange={(_, d) => setLabel(d.value)} />
      </Field>
      <Field
        label={t(`${P}.fields.shipContainers` as never)}
        hint={t(`${P}.hints.shipContainers` as never)}
      >
        <Checkbox
          checked={shipContainers}
          onChange={(_, d) => setShipContainers(d.checked === true)}
          label={t(`${P}.fields.shipContainers` as never)}
        />
      </Field>
      <Field label={t(`${P}.fields.comment` as never)}>
        <Input value={comment} onChange={(_, d) => setComment(d.value)} />
      </Field>
    </BaseDialog>
  );
}

export function PackageReportDialog({ open, onClose }: Omit<DialogProps, "onSubmit">) {
  const { t } = useAppTranslation();
  const P = "businessData.package.operations.report";
  const styles = useDialogStyles();
  return (
    <BaseDialog size="lg"
      open={open}
      onClose={onClose}
      title={t(`${P}.title` as never)}
      footer={<Button onClick={onClose}>{t(`${P}.close` as never)}</Button>}
    >
      <div className={styles.field}>
        <Text size={300}>{t(`${P}.description` as never)}</Text>
      </div>
      <Field label={t(`${P}.fields.level1` as never)}>
        <Text size={300}>{t(`${P}.level1Fields` as never)}</Text>
      </Field>
      <Field label={t(`${P}.fields.level2` as never)}>
        <Text size={300}>{t(`${P}.level2Fields` as never)}</Text>
      </Field>
    </BaseDialog>
  );
}
