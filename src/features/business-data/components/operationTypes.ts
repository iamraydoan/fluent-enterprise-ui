import type { TranslationKey } from "@/i18n";

export type WizardFieldType = "text" | "textarea" | "number" | "checkbox" | "select" | "date";

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
}

export interface WizardStep {
  titleKey: TranslationKey;
  fields: WizardField[];
}

export type OperationValues = Record<string, string | number | boolean>;
