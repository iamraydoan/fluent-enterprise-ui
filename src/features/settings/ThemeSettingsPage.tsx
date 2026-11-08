import { VStack } from "@/components/common";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { ThemeSettingsPanel } from "./ThemeSettingsPanel";

export function ThemeSettingsPage() {
  const { t } = useAppTranslation();
  return (
    <VStack gap="lg" p="lg">
      <Text size={500} weight="semibold">
        {t("settings.title")}
      </Text>
      <Text>{t("settings.subtitle")}</Text>
      <ThemeSettingsPanel />
    </VStack>
  );
}
