import { useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { FormField, Grid, HStack, VStack, WizardSteps } from "@/components/common";
import {
  ChevronDown16Regular,
  ChevronDown20Regular,
  ChevronLeft20Regular,
  ChevronRight20Regular,
  ChevronUp20Regular,
  Dismiss16Regular,
  QuestionCircle20Regular,
  Sparkle24Filled,
} from "@/components/icons";
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
  mergeClasses,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { cardSurface, tileSurface } from "@/styles/shared";
import { theme } from "@/styles/theme";
import type { OperationOnChange, OperationValues, WizardField, WizardStep } from "./operationTypes";

const useWizardStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    placeItems: "center",
    padding: "24px",
    boxSizing: "border-box",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  surface: {
    width: "min(1100px, calc(100vw - 48px))",
    maxHeight: "min(860px, calc(100vh - 48px))",
    overflow: "hidden",
    ...cardSurface,
  },
  headBand: {
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "56px",
    padding: "0 12px 0 20px",
    ...tileSurface,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    flexShrink: 0,
  },
  headTitle: { alignItems: "center", columnGap: "10px" },
  headIcon: { color: theme.color.textPrimary },
  headActions: { alignItems: "center", columnGap: "4px" },
  body: {
    flexGrow: 1,
    minHeight: 0,
    overflowY: "auto",
    padding: "20px 24px",
    rowGap: "20px",
    backgroundColor: theme.color.surface,
  },
  section: { rowGap: "12px" },
  sectionTitle: { fontSize: "14px", marginBottom: "4px" },
  fieldLabel: {
    fontSize: "13px",
    color: theme.color.textSecondary,
    textAlign: "right",
    lineHeight: "36px",
  },
  fieldRequired: { color: theme.color.textDanger, marginRight: "4px" },
  wizardControl: { minHeight: "36px", width: "100%", boxSizing: "border-box" },
  inputWrap: { width: "100%" },
  comboBox: {
    alignItems: "center",
    columnGap: "8px",
    minHeight: "36px",
    width: "100%",
    boxSizing: "border-box",
    padding: "0 8px",
    backgroundColor: theme.color.surface,
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.md,
    cursor: "pointer",
  },
  comboIcon: { color: theme.color.textBrand, flexShrink: 0 },
  comboText: {
    flexGrow: 1,
    fontSize: "14px",
    color: theme.color.textPrimary,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "left",
  },
  comboPlaceholder: { color: theme.color.textTertiary },
  comboChevron: { color: theme.color.textSecondary, flexShrink: 0 },
  commentsBar: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 24px",
    borderTop: `1px solid ${theme.color.borderSubtle}`,
    cursor: "pointer",
    flexShrink: 0,
    backgroundColor: theme.color.surface,
  },
  commentsBody: { padding: "0 24px 16px", backgroundColor: theme.color.surface, flexShrink: 0 },
  foot: {
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: "8px",
    padding: "12px 24px",
    ...tileSurface,
    borderTop: `1px solid ${theme.color.borderSubtle}`,
    flexShrink: 0,
  },
  error: {
    fontSize: "12px",
    color: theme.color.textDanger,
    padding: "0 24px 8px",
    backgroundColor: theme.color.surface,
    flexShrink: 0,
  },
});

interface EntityWizardDialogProps {
  open: boolean;
  titleKey: TranslationKey;
  steps: WizardStep[];
  initialValues?: OperationValues;
  submitLabelKey: TranslationKey;
  onClose: () => void;
  onSubmit: (values: OperationValues) => void;
  titleIcon?: ReactNode;
  onHelp?: () => void;
  commentsValue?: string;
  onCommentsChange?: (value: string) => void;
}

export function EntityWizardDialog({
  open,
  titleKey,
  steps,
  initialValues = {},
  submitLabelKey,
  onClose,
  onSubmit,
  titleIcon,
  onHelp,
  commentsValue,
  onCommentsChange,
}: EntityWizardDialogProps) {
  const { t } = useAppTranslation();
  const styles = useWizardStyles();
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<OperationValues>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);

  if (!open) return null;

  const step = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;
  const sections = step.sections ?? [];
  const hasSections = sections.length > 0;
  const stepFields = hasSections ? sections.flatMap((s) => s.fields) : step.fields;

  const setValue: OperationOnChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const validateStep = (): boolean => {
    for (const field of stepFields) {
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
      onSubmit(onCommentsChange ? { ...values, comments: commentsValue ?? "" } : values);
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleClose = () => {
    setStepIndex(0);
    setValues(initialValues);
    setError(null);
    setCommentsOpen(false);
    onClose();
  };

  const toggleComments = () => setCommentsOpen((prev) => !prev);
  const handleCommentsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleComments();
    }
  };

  return (
    <Grid className={styles.overlay} onClick={handleClose}>
      <VStack gap="none" className={styles.surface} onClick={(event) => event.stopPropagation()}>
        <HStack gap="none" className={styles.headBand}>
          <HStack gap="10px" className={styles.headTitle}>
            <HStack gap="none" className={styles.headIcon}>
              {titleIcon ?? <Sparkle24Filled />}
            </HStack>
            <Text weight="semibold" size={400}>
              {t(titleKey)}
            </Text>
          </HStack>
          <HStack gap="4px" className={styles.headActions}>
            {onHelp && (
              <Button
                variant="transparent"
                icon={<QuestionCircle20Regular />}
                aria-label={t("common.help")}
                onClick={onHelp}
              />
            )}
            <Button
              variant="transparent"
              icon={<Dismiss16Regular />}
              aria-label={t("common.close")}
              onClick={handleClose}
            />
          </HStack>
        </HStack>
        {steps.length > 1 && (
          <WizardSteps
            variant="band"
            steps={steps.map((s) => t(s.titleKey))}
            current={stepIndex + 1}
          />
        )}
        <VStack gap="20px" className={styles.body}>
          {hasSections ? (
            sections.map((section) => (
              <VStack key={section.titleKey} gap="12px" className={styles.section}>
                <Text weight="semibold" className={styles.sectionTitle}>
                  {t(section.titleKey)}
                </Text>
                {section.fields.map((field) => (
                  <WizardFieldInput
                    key={field.key}
                    field={field}
                    values={values}
                    onChange={setValue}
                  />
                ))}
              </VStack>
            ))
          ) : (
            <VStack gap="12px" className={styles.section}>
              <Text weight="semibold" className={styles.sectionTitle}>
                {t(step.titleKey)}
              </Text>
              {step.fields.map((field) => (
                <WizardFieldInput
                  key={field.key}
                  field={field}
                  values={values}
                  onChange={setValue}
                />
              ))}
            </VStack>
          )}
        </VStack>
        {error && <div className={styles.error}>{error}</div>}
        {onCommentsChange && (
          <>
            <HStack
              gap="none"
              className={styles.commentsBar}
              role="button"
              tabIndex={0}
              aria-expanded={commentsOpen}
              onClick={toggleComments}
              onKeyDown={handleCommentsKeyDown}
            >
              <Text size={300}>{t("dialogs.commentsLabel")}</Text>
              {commentsOpen ? <ChevronUp20Regular /> : <ChevronDown20Regular />}
            </HStack>
            {commentsOpen && (
              <div className={styles.commentsBody}>
                <Textarea
                  value={commentsValue ?? ""}
                  onChange={onCommentsChange}
                  rows={3}
                  className={styles.wizardControl}
                />
              </div>
            )}
          </>
        )}
        <HStack gap="8px" className={styles.foot}>
          <Button variant="secondary" onClick={handleClose}>
            {t("common.cancel")}
          </Button>
          {!isFirst && (
            <Button
              variant="secondary"
              icon={<ChevronLeft20Regular />}
              onClick={() => setStepIndex(stepIndex - 1)}
            >
              {t("common.back")}
            </Button>
          )}
          <Button
            variant="primary"
            icon={isLast ? undefined : <ChevronRight20Regular />}
            iconPosition={isLast ? undefined : "after"}
            onClick={handleNext}
          >
            {isLast ? t(submitLabelKey) : t("common.next")}
          </Button>
        </HStack>
      </VStack>
    </Grid>
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
      {field.required && <span className={styles.fieldRequired}>*</span>}
      {t(field.labelKey)}:
    </span>
  );

  if (field.type === "custom" && field.render) {
    return <div>{field.render(values, onChange)}</div>;
  }

  if (field.type === "checkbox") {
    return (
      <FormField label={label} labelWidth="180px">
        <Checkbox
          checked={value === true}
          onChange={(checked) => onChange(field.key, checked === true)}
        />
      </FormField>
    );
  }

  if (field.type === "textarea") {
    return (
      <FormField label={label} labelWidth="180px">
        <div
          className={styles.inputWrap}
          style={field.inputWidth ? { width: field.inputWidth } : undefined}
        >
          <Textarea
            value={typeof value === "string" ? value : ""}
            onChange={(value) => onChange(field.key, value)}
            placeholder={field.placeholderKey ? t(field.placeholderKey) : undefined}
            className={styles.wizardControl}
          />
        </div>
      </FormField>
    );
  }

  if (field.type === "select") {
    const selected = field.options?.find((o) => o.value === value);
    const hasValue = value !== undefined && value !== null && value !== "";
    return (
      <FormField label={label} labelWidth="180px">
        <div
          className={styles.inputWrap}
          style={field.inputWidth ? { width: field.inputWidth } : undefined}
        >
          <Menu
            positioning="below-start"
            checkedValues={{ selected: hasValue ? [String(value)] : [] }}
            onCheckedValueChange={(checkedItems) => onChange(field.key, checkedItems[0] ?? "")}
          >
            <MenuTrigger disableButtonEnhancement>
              <HStack gap="8px" className={styles.comboBox} role="button" tabIndex={0}>
                {field.leadingIcon && (
                  <HStack gap="none" className={styles.comboIcon}>
                    {field.leadingIcon}
                  </HStack>
                )}
                <span
                  className={mergeClasses(styles.comboText, !hasValue && styles.comboPlaceholder)}
                >
                  {selected?.label ?? t("businessData.operations.selectOption")}
                </span>
                {hasValue && (
                  <Button
                    variant="transparent"
                    icon={<Dismiss16Regular />}
                    aria-label={t("common.clear")}
                    onClick={(event) => {
                      event.stopPropagation();
                      onChange(field.key, "");
                    }}
                  />
                )}
                <HStack gap="none" className={styles.comboChevron}>
                  <ChevronDown16Regular />
                </HStack>
              </HStack>
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
      </FormField>
    );
  }

  return (
    <FormField label={label} labelWidth="180px">
      <div
        className={styles.inputWrap}
        style={field.inputWidth ? { width: field.inputWidth } : undefined}
      >
        <Input
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
          value={value === undefined || typeof value === "boolean" ? "" : String(value)}
          onChange={(value) => onChange(field.key, field.type === "number" ? Number(value) : value)}
          placeholder={field.placeholderKey ? t(field.placeholderKey) : undefined}
          contentBefore={field.leadingIcon ?? undefined}
          className={styles.wizardControl}
        />
      </div>
    </FormField>
  );
}
