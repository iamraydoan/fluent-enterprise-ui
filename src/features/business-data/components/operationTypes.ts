import type { ReactElement, ReactNode } from "react";
import type { TranslationKey } from "@/i18n";

type WizardFieldType = "text" | "textarea" | "number" | "checkbox" | "select" | "date" | "custom";

interface WizardFieldOption {
  value: string;
  label: string;
}

export interface WizardField {
  key: string;
  labelKey: TranslationKey;
  type: WizardFieldType;
  options?: WizardFieldOption[];
  required?: boolean;
  placeholderKey?: TranslationKey;
  render?: (values: OperationValues, onChange: OperationOnChange) => ReactNode;
  leadingIcon?: ReactElement;
  inputWidth?: string;
}

interface WizardSection {
  titleKey: TranslationKey;
  fields: WizardField[];
}

export interface WizardStep {
  titleKey: TranslationKey;
  fields: WizardField[];
  sections?: WizardSection[];
}

export type OperationOnChange = (key: string, value: unknown) => void;

export type OperationValues = Record<string, unknown>;
