import { useState } from "react";
import { Dismiss16Regular } from "@/components/icons";
import {
  Button,
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
  PARAMETER_DATA_TYPES,
  PARAMETER_SCOPES,
  PARAMETER_TYPES,
} from "./parameterOptions";

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
  steps: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  step: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  stepNumber: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    fontSize: "11px",
    fontWeight: 700,
    backgroundColor: tokens.colorNeutralBackground5,
    color: tokens.colorNeutralForeground2,
  },
  stepActive: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
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
          <Text size={400} weight="semibold">{title}</Text>
          <Button
            appearance="subtle"
            icon={<Dismiss16Regular />}
            onClick={onClose}
            aria-label={t("businessData.parameter.operations._shared.close" as never)}
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
          <Button style={{ width: "100%", justifyContent: "space-between" }}>
            {value}
          </Button>
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

export function CreateParameterDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const P = "businessData.parameter.operations.create";
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(PARAMETER_TYPES[0]);
  const [displayName, setDisplayName] = useState("");
  const [scope, setScope] = useState(PARAMETER_SCOPES[0]);
  const [dataType, setDataType] = useState(PARAMETER_DATA_TYPES[0]);
  const [units, setUnits] = useState("");

  const handleClose = () => {
    setStep(0); setName(""); setDescription(""); setType(PARAMETER_TYPES[0]);
    setDisplayName(""); setScope(PARAMETER_SCOPES[0]); setDataType(PARAMETER_DATA_TYPES[0]);
    setUnits("");
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
          {step > 0 && (
            <Button onClick={() => setStep(step - 1)}>{t(`${P}.back` as never)}</Button>
          )}
          {step < 1 ? (
            <Button appearance="primary" onClick={() => setStep(step + 1)}>
              {t(`${P}.next` as never)}
            </Button>
          ) : (
            <Button
              appearance="primary"
              onClick={() => { onSubmit?.(); handleClose(); }}
              disabled={!name}
            >
              {t(`${P}.submit` as never)}
            </Button>
          )}
        </>
      }
    >
      <div className={styles.steps}>
        {[0, 1].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {i > 0 && (
              <div style={{ width: "24px", height: "1px", backgroundColor: tokens.colorNeutralStroke2 }} />
            )}
            <div className={styles.step}>
              <span className={`${styles.stepNumber} ${i === step ? styles.stepActive : ""}`}>
                {i + 1}
              </span>
              <span>{t(`${P}.steps.${i === 0 ? "generalData" : "information"}` as never)}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ paddingTop: "16px" }}>
        {step === 0 && (
          <>
            <Field label={t(`${P}.fields.name` as never)} required>
              <Input value={name} onChange={(_, d) => setName(d.value)} />
            </Field>
            <Field label={t(`${P}.fields.description` as never)}>
              <Input value={description} onChange={(_, d) => setDescription(d.value)} />
            </Field>
            <SelectField
              label={t(`${P}.fields.type` as never)}
              value={type}
              options={PARAMETER_TYPES}
              onSelect={setType}
              required
              hint={t(`${P}.hints.type` as never)}
            />
          </>
        )}
        {step === 1 && (
          <>
            <Field label={t(`${P}.fields.displayName` as never)} hint={t(`${P}.hints.displayName` as never)}>
              <Input value={displayName} onChange={(_, d) => setDisplayName(d.value)} />
            </Field>
            <SelectField
              label={t(`${P}.fields.scope` as never)}
              value={scope}
              options={PARAMETER_SCOPES}
              onSelect={setScope}
              required
            />
            <SelectField
              label={t(`${P}.fields.dataType` as never)}
              value={dataType}
              options={PARAMETER_DATA_TYPES}
              onSelect={setDataType}
              required
              hint={t(`${P}.hints.dataType` as never)}
            />
            <Field label={t(`${P}.fields.units` as never)}>
              <Input value={units} onChange={(_, d) => setUnits(d.value)} />
            </Field>
          </>
        )}
      </div>
    </DialogShell>
  );
}

export function EditParameterDialog({
  open,
  onClose,
  onSubmit,
  initialName,
}: DialogProps & { initialName?: string }) {
  const { t } = useAppTranslation();
  const P = "businessData.parameter.operations.edit";
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

export function CloneParameterDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.parameter.operations.clone";
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

export function TerminateParameterDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.parameter.operations.terminate";
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

export function UnterminateParameterDialog({ open, onClose, onSubmit }: DialogProps) {
  const { t } = useAppTranslation();
  const P = "businessData.parameter.operations.unterminate";
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
