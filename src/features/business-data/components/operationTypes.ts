import type { ReactNode } from "react";
import type { TranslationKey } from "@/i18n";

export type WizardFieldType =
  "text" | "textarea" | "number" | "checkbox" | "select" | "date" | "custom";

export interface WizardFieldOption {
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
  render?: (
    values: OperationValues,
    onChange: (key: string, value: string | number | boolean) => void,
  ) => ReactNode;
}

export interface WizardStep {
  titleKey: TranslationKey;
  fields: WizardField[];
}

export type OperationValues = Record<string, string | number | boolean>;
