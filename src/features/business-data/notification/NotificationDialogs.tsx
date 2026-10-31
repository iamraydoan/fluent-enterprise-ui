import { useState } from "react";
import { Dismiss16Regular } from "@/components/icons";
import {
  Button,
  Checkbox,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Text,
  makeStyles,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { cardSurface } from "@/styles/shared";
import {
  NOTIFICATION_ASSIGNMENTS,
  NOTIFICATION_CLEARANCES,
  NOTIFICATION_SEVERITIES,
  NOTIFICATION_TYPES,
  NOTIFICATION_VISIBILITIES,
} from "./notificationOptions";

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
  row: { display: "flex", gap: "12px" },
  col: { flex: 1 },
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
            aria-label={t("businessData.notification.operations._shared.close")}
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

function SelectField({
  label,
  value,
  options,
  onSelect,
  required,
  hint,
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (v: string) => void;
  required?: boolean;
  hint?: string;
}) {
  return (
    <Field label={label} required={required} hint={hint}>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Button style={{ width: "100%", justifyContent: "space-between" }}>{value}</Button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {options.map((opt) => (
              <MenuItem key={opt} onClick={() => onSelect(opt)}>
                {opt}
              </MenuItem>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    </Field>
  );
}

export function CreateNotificationDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.notification.operations.create";
  const [name, setName] = useState("");
  const [type, setType] = useState(NOTIFICATION_TYPES[0]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [severity, setSeverity] = useState(NOTIFICATION_SEVERITIES[0]);
  const [assignment, setAssignment] = useState("Everyone");
  const [sendEmail, setSendEmail] = useState(false);
  const [visibility, setVisibility] = useState("None");
  const [clearance, setClearance] = useState("ManualSingleUser");
  const [validTo, setValidTo] = useState("");

  const handleClose = () => {
    setName("");
    setType(NOTIFICATION_TYPES[0]);
    setTitle("");
    setDetails("");
    setSeverity(NOTIFICATION_SEVERITIES[0]);
    setAssignment("Everyone");
    setSendEmail(false);
    setVisibility("None");
    setClearance("ManualSingleUser");
    setValidTo("");
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
      <Field label={t(`${P}.fields.name` as never)} hint={t(`${P}.hints.name` as never)}>
        <Input value={name} onChange={(_, d) => setName(d.value)} />
      </Field>
      <SelectField
        label={t(`${P}.fields.type` as never)}
        value={type}
        options={NOTIFICATION_TYPES}
        onSelect={setType}
        required
        hint={t(`${P}.hints.type` as never)}
      />
      <Field label={t(`${P}.fields.title` as never)} required hint={t(`${P}.hints.title` as never)}>
        <Input value={title} onChange={(_, d) => setTitle(d.value)} />
      </Field>
      <Field label={t(`${P}.fields.details` as never)}>
        <Input value={details} onChange={(_, d) => setDetails(d.value)} />
      </Field>
      <SelectField
        label={t(`${P}.fields.severity` as never)}
        value={severity}
        options={NOTIFICATION_SEVERITIES}
        onSelect={setSeverity}
        required
      />
      <SelectField
        label={t(`${P}.fields.assignment` as never)}
        value={assignment}
        options={NOTIFICATION_ASSIGNMENTS}
        onSelect={setAssignment}
        required
      />
      <Field label={t(`${P}.fields.sendEmail` as never)}>
        <Checkbox
          checked={sendEmail}
          onChange={(_, d) => setSendEmail(d.checked === true)}
          label={t(`${P}.fields.sendEmail` as never)}
        />
      </Field>
      <SelectField
        label={t(`${P}.fields.visibility` as never)}
        value={visibility}
        options={NOTIFICATION_VISIBILITIES}
        onSelect={setVisibility}
        hint={t(`${P}.hints.visibility` as never)}
      />
      <SelectField
        label={t(`${P}.fields.clearance` as never)}
        value={clearance}
        options={NOTIFICATION_CLEARANCES}
        onSelect={setClearance}
        required
      />
      <Field
        label={t(`${P}.fields.validTo` as never)}
        required={clearance !== "ManualSingleUser"}
        hint={t(`${P}.hints.validTo` as never)}
      >
        <Input
          value={validTo}
          onChange={(_, d) => setValidTo(d.value)}
          placeholder={t(
            "businessData.notification.operations.create.placeholders.validTo" as never,
          )}
        />
      </Field>
    </DialogShell>
  );
}

export function EditNotificationDialog({
  open,
  onClose,
  onSubmit,
  initialName,
}: DialogProps & { initialName?: string }) {
  const { t } = useAppTranslation();
  const P = "businessData.notification.operations.edit";
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState(NOTIFICATION_SEVERITIES[0]);

  const handleClose = () => {
    setTitle("");
    setSeverity(NOTIFICATION_SEVERITIES[0]);
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
      <Field label={t(`${P}.fields.title` as never)}>
        <Input value={title} onChange={(_, d) => setTitle(d.value)} />
      </Field>
      <SelectField
        label={t(`${P}.fields.severity` as never)}
        value={severity}
        options={NOTIFICATION_SEVERITIES}
        onSelect={setSeverity}
      />
    </DialogShell>
  );
}

export function CloneNotificationDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.notification.operations.clone";
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

export function TerminateNotificationDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.notification.operations.terminate";

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

export function ClearNotificationDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.notification.operations.clear";

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
