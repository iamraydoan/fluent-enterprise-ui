import type { TranslationKey } from "@/i18n";

export interface EnumOption<T extends string> {
  value: T;
  labelKey: TranslationKey;
}

export function enumOptions<T extends string>(
  values: readonly T[],
  labels: Record<T, TranslationKey>,
): EnumOption<T>[] {
  return values.map((value) => ({ value, labelKey: labels[value] }));
}
