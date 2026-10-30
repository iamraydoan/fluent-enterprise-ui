import { useAppTranslation } from "@/i18n";

export function useBooleanLabel() {
  const { t } = useAppTranslation();
  return (value: boolean) => (value ? t("common.yes") : t("common.no"));
}

export function booleanLabel(value: boolean): string {
  return value ? "Yes" : "No";
}
