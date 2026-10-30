import { useState } from "react";
import { Dismiss16Regular } from "@/components/icons";
import { Button, Checkbox, Input, Text, makeStyles, tokens } from "@/components/ui";
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
            aria-label={t("businessData.package.operations._shared.close" as never)}
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

export function UnterminatePackageDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.package.operations.unterminate";
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
    </DialogShell>
  );
}

export function PackageReportDialog({ open, onClose }: Omit<DialogProps, "onSubmit">) {
  const { t } = useAppTranslation();
  const P = "businessData.package.operations.report";
  const styles = useDialogStyles();
  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title={t(`${P}.title` as never)}
      wide
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
    </DialogShell>
  );
}
