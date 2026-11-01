import { useState } from "react";
import { FormField, IconButton, HStack, VStack  } from "@/components/common";
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
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { cardSurface } from "@/styles/shared";
import { theme } from "@/styles/theme";
import type { OperationOnChange, OperationValues, WizardField, WizardStep } from "./operationTypes";

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
    overflow: "hidden",
    ...cardSurface,
  },
  head: {
    minHeight: "52px",
    padding: "0 16px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  
  closeButton: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: "6px",
    borderRadius: theme.radius.md,
    display: "flex",
    ":hover": { backgroundColor: theme.color.surfaceHover },
  },
  steps: {
    padding: "12px 24px 0",
  },
  stepPill: {
    flexGrow: 1,
    height: "4px",
    borderRadius: "2px",
    backgroundColor: theme.color.borderSubtle,
  },
  stepPillActive: { backgroundColor: theme.color.borderBrand },
  stepTitle: {
    padding: "12px 24px 0",
    fontSize: "14px",
    fontWeight: theme.font.weightSemibold,
    flexShrink: 0,
  },
  body: {
    minHeight: 0,
    overflowY: "auto",
    padding: "16px 24px",
  },
  fieldLabel: { fontSize: "13px", color: theme.color.textSecondary, textAlign: "right" },
  fieldRequired: { color: theme.color.textDanger },
  foot: {
    padding: "12px 24px",
    borderTop: `1px solid ${theme.color.borderSubtle}`,
  },
  
  selectButton: {
    width: "100%",
    justifyContent: "space-between",
  },
  error: { fontSize: "12px", color: theme.color.textDanger, padding: "0 24px" },
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

  const setValue: OperationOnChange = (key, value) => {
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
      <VStack onClick={(event) => event.stopPropagation()} className={styles.surface}>
        <HStack align="center" justify="space-between" className={styles.head}>
          <HStack gap="10px" align="center">
            <Text weight="semibold">{t(titleKey)}</Text>
          </HStack>
          <IconButton
            icon={<Dismiss16Regular />}
            onClick={handleClose}
            aria-label={t("common.close")}
            size="sm"
          />
        </HStack>
        {steps.length > 1 && (
          <HStack gap="8px" className={styles.steps}>
            {steps.map((s, index) => (
              <div
                key={s.titleKey}
                className={`${styles.stepPill} ${index <= stepIndex ? styles.stepPillActive : ""}`}
              />
            ))}
          </HStack>
        )}
        <div className={styles.stepTitle}>{t(step.titleKey)}</div>
        <VStack gap="12px" className={styles.body}>
          {step.fields.map((field) => (
            <WizardFieldInput key={field.key} field={field} values={values} onChange={setValue} />
          ))}
        </VStack>
        {error && <div className={styles.error}>{error}</div>}
        <HStack align="center" justify="space-between" className={styles.foot}>
          <HStack gap="8px" align="center">
            {!isFirst && (
              <Button
                variant="secondary"
                icon={<ChevronLeft20Regular />}
                onClick={() => setStepIndex(stepIndex - 1)}
              >
                {t("common.back")}
              </Button>
            )}
          </HStack>
          <HStack gap="8px" align="center">
            <Button variant="secondary" onClick={handleClose}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="primary"
              icon={isLast ? undefined : <ChevronRight20Regular />}
              iconPosition={isLast ? undefined : "after"}
              onClick={handleNext}
            >
              {isLast ? t(submitLabelKey) : t("common.next")}
            </Button>
          </HStack>
        </HStack>
      </VStack>
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
  onChange: OperationOnChange;
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

  if (field.type === "custom" && field.render) {
    return <div>{field.render(values, onChange)}</div>;
  }

  if (field.type === "checkbox") {
    return (
      <FormField label={label} labelWidth="170px">
        {label}
        <Checkbox
          checked={value === true}
          onChange={(checked) => onChange(field.key, checked === true)}
        />
      </FormField>
    );
  }

  if (field.type === "textarea") {
    return (
      <FormField label={label} labelWidth="170px">
        {label}
        <Textarea
          value={typeof value === "string" ? value : ""}
          onChange={(value) => onChange(field.key, value)}
        />
      </FormField>
    );
  }

  if (field.type === "select") {
    const selected = field.options?.find((o) => o.value === value);
    return (
      <FormField label={label} labelWidth="170px">
        {label}
        <Menu
          positioning="below-start"
          checkedValues={{ selected: value === undefined ? [] : [String(value)] }}
          onCheckedValueChange={(checkedItems) => onChange(field.key, checkedItems[0] ?? "")}
        >
          <MenuTrigger disableButtonEnhancement>
            <Button variant="secondary" className={styles.selectButton}>
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
      </FormField>
    );
  }

  return (
    <FormField label={label} labelWidth="170px">
      {label}
      <Input
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        value={value === undefined || typeof value === "boolean" ? "" : String(value)}
        onChange={(value) => onChange(field.key, field.type === "number" ? Number(value) : value)}
      />
    </FormField>
  );
}
