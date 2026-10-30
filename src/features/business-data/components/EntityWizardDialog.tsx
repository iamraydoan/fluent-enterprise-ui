import { useState } from "react";
import { ChevronLeft20Regular, ChevronRight20Regular, Dismiss16Regular } from "@/components/icons";
import {
  Button,
  Checkbox,
  Input,
  Menu,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Text,
  Textarea,
  makeStyles,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { cardSurface } from "@/styles/shared";
import type { OperationValues, WizardField, WizardStep } from "./operationTypes";

const useWizardStyles = makeStyles({
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
    width: "min(640px, calc(100vw - 48px))",
    maxHeight: "min(720px, calc(100vh - 48px))",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    ...cardSurface,
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "52px",
    padding: "0 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  headTitle: { display: "flex", alignItems: "center", columnGap: "10px" },
  closeButton: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: "6px",
    borderRadius: tokens.borderRadiusMedium,
    display: "flex",
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  steps: {
    display: "flex",
    columnGap: "8px",
    padding: "12px 24px 0",
    flexShrink: 0,
  },
  stepPill: {
    flexGrow: 1,
    height: "4px",
    borderRadius: "2px",
    backgroundColor: tokens.colorNeutralStroke2,
  },
  stepPillActive: { backgroundColor: tokens.colorBrandStroke1 },
  stepTitle: {
    padding: "12px 24px 0",
    fontSize: "14px",
    fontWeight: tokens.fontWeightSemibold,
    flexShrink: 0,
  },
  body: {
    flexGrow: 1,
    minHeight: 0,
    overflowY: "auto",
    padding: "16px 24px",
    display: "flex",
    flexDirection: "column",
    rowGap: "12px",
  },
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "170px minmax(0, 1fr)",
    alignItems: "center",
    columnGap: "12px",
  },
  fieldLabel: { fontSize: "13px", color: tokens.colorNeutralForeground2, textAlign: "right" },
  fieldRequired: { color: tokens.colorPaletteRedForeground1 },
  foot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  footGroup: { display: "flex", columnGap: "8px", alignItems: "center" },
  selectButton: {
    width: "100%",
    justifyContent: "space-between",
  },
  error: { fontSize: "12px", color: tokens.colorPaletteRedForeground1, padding: "0 24px" },
});

interface EntityWizardDialogProps {
  open: boolean;
  titleKey: TranslationKey;
  steps: WizardStep[];
  initialValues?: OperationValues;
  submitLabelKey: TranslationKey;
  onClose: () => void;
  onSubmit: (values: OperationValues) => void;
}

export function EntityWizardDialog({
  open,
  titleKey,
  steps,
  initialValues = {},
  submitLabelKey,
  onClose,
  onSubmit,
}: EntityWizardDialogProps) {
  const { t } = useAppTranslation();
  const styles = useWizardStyles();
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<OperationValues>(initialValues);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const step = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  const setValue = (key: string, value: string | number | boolean) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const validateStep = (): boolean => {
    for (const field of step.fields) {
      if (field.required) {
        const value = values[field.key];
        if (value === undefined || value === null || value === "") {
          setError(t("businessData.operations.fieldRequired"));
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (isLast) {
      onSubmit(values);
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleClose = () => {
    setStepIndex(0);
    setValues(initialValues);
    setError(null);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.surface} onClick={(event) => event.stopPropagation()}>
        <div className={styles.head}>
          <div className={styles.headTitle}>
            <Text weight="semibold">{t(titleKey)}</Text>
          </div>
          <button className={styles.closeButton} onClick={handleClose} aria-label={t("common.close")}>
            <Dismiss16Regular />
          </button>
        </div>
        {steps.length > 1 && (
          <div className={styles.steps}>
            {steps.map((s, index) => (
              <div
                key={s.titleKey}
                className={`${styles.stepPill} ${index <= stepIndex ? styles.stepPillActive : ""}`}
              />
            ))}
          </div>
        )}
        <div className={styles.stepTitle}>{t(step.titleKey)}</div>
        <div className={styles.body}>
          {step.fields.map((field) => (
            <WizardFieldInput key={field.key} field={field} values={values} onChange={setValue} />
          ))}
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.foot}>
          <div className={styles.footGroup}>
            {!isFirst && (
              <Button
                appearance="secondary"
                icon={<ChevronLeft20Regular />}
                onClick={() => setStepIndex(stepIndex - 1)}
              >
                {t("common.back")}
              </Button>
            )}
          </div>
          <div className={styles.footGroup}>
            <Button appearance="secondary" onClick={handleClose}>
              {t("common.cancel")}
            </Button>
            <Button
              appearance="primary"
              icon={isLast ? undefined : <ChevronRight20Regular />}
              iconPosition={isLast ? undefined : "after"}
              onClick={handleNext}
            >
              {isLast ? t(submitLabelKey) : t("common.next")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WizardFieldInput({
  field,
  values,
  onChange,
}: {
  field: WizardField;
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useWizardStyles();
  const value = values[field.key];

  const label = (
    <span className={styles.fieldLabel}>
      {t(field.labelKey)}
      {field.required && <span className={styles.fieldRequired}> *</span>}
    </span>
  );

  if (field.type === "checkbox") {
    return (
      <div className={styles.fieldRow}>
        {label}
        <Checkbox
          checked={value === true}
          onChange={(_, data) => onChange(field.key, data.checked === true)}
        />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className={styles.fieldRow}>
        {label}
        <Textarea
          value={typeof value === "string" ? value : ""}
          onChange={(_, data) => onChange(field.key, data.value)}
        />
      </div>
    );
  }

  if (field.type === "select") {
    const selected = field.options?.find((o) => o.value === value);
    return (
      <div className={styles.fieldRow}>
        {label}
        <Menu
          positioning="below-start"
          checkedValues={{ selected: value === undefined ? [] : [String(value)] }}
          onCheckedValueChange={(_, data) =>
            onChange(field.key, data.checkedItems[0] ?? "")
          }
        >
          <MenuTrigger disableButtonEnhancement>
            <Button appearance="secondary" className={styles.selectButton}>
              {selected?.label ?? t("businessData.operations.selectOption")}
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {(field.options ?? []).map((option) => (
                <MenuItemRadio key={option.value} name="selected" value={option.value}>
                  {option.label}
                </MenuItemRadio>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    );
  }

  return (
    <div className={styles.fieldRow}>
      {label}
      <Input
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        value={value === undefined || typeof value === "boolean" ? "" : String(value)}
        onChange={(_, data) =>
          onChange(field.key, field.type === "number" ? Number(data.value) : data.value)
        }
      />
    </div>
  );
}
