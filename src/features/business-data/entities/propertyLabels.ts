import { useAppTranslation } from "@/i18n";

export function useBooleanLabel() {
  const { t } = useAppTranslation();
  return (value: boolean) => (value ? t("common.yes") : t("common.no"));
}

