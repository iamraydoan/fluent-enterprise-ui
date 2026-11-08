import { HStack, Section, VStack } from "@/components/common";
import { Button, Radio, RadioGroup } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import {
  BRAND_OPTIONS,
  CONTENT_WIDTH_OPTIONS,
  DENSITY_OPTIONS,
  RADIUS_OPTIONS,
  SCHEME_OPTIONS,
  SIDEBAR_OPTIONS,
} from "./settings-config";
import type { SettingOption } from "./settings-config";
import { useThemeSettingsStore } from "./settings-store";

function SettingGroup<T extends string>({
  titleKey,
  options,
  value,
  onChange,
}: {
  titleKey: TranslationKey;
  options: SettingOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const { t } = useAppTranslation();
  return (
    <Section title={t(titleKey)}>
      <RadioGroup aria-label={t(titleKey)} value={value} onChange={(next) => onChange(next as T)}>
        {options.map((option) => (
          <Radio key={option.value} value={option.value} label={t(option.labelKey)} />
        ))}
      </RadioGroup>
    </Section>
  );
}

export function ThemeSettingsPanel() {
  const { t } = useAppTranslation();
  const brand = useThemeSettingsStore((state) => state.brand);
  const scheme = useThemeSettingsStore((state) => state.scheme);
  const radius = useThemeSettingsStore((state) => state.radius);
  const density = useThemeSettingsStore((state) => state.density);
  const sidebarLayout = useThemeSettingsStore((state) => state.sidebarLayout);
  const contentWidth = useThemeSettingsStore((state) => state.contentWidth);
  const setBrand = useThemeSettingsStore((state) => state.setBrand);
  const setScheme = useThemeSettingsStore((state) => state.setScheme);
  const setRadius = useThemeSettingsStore((state) => state.setRadius);
  const setDensity = useThemeSettingsStore((state) => state.setDensity);
  const setSidebarLayout = useThemeSettingsStore((state) => state.setSidebarLayout);
  const setContentWidth = useThemeSettingsStore((state) => state.setContentWidth);
  const resetThemeSettings = useThemeSettingsStore((state) => state.resetThemeSettings);
  return (
    <VStack gap="lg">
      <SettingGroup
        titleKey="settings.brand.title"
        options={BRAND_OPTIONS}
        value={brand}
        onChange={setBrand}
      />
      <SettingGroup
        titleKey="settings.scheme.title"
        options={SCHEME_OPTIONS}
        value={scheme}
        onChange={setScheme}
      />
      <SettingGroup
        titleKey="settings.radius.title"
        options={RADIUS_OPTIONS}
        value={radius}
        onChange={setRadius}
      />
      <SettingGroup
        titleKey="settings.density.title"
        options={DENSITY_OPTIONS}
        value={density}
        onChange={setDensity}
      />
      <SettingGroup
        titleKey="settings.sidebar.title"
        options={SIDEBAR_OPTIONS}
        value={sidebarLayout}
        onChange={setSidebarLayout}
      />
      <SettingGroup
        titleKey="settings.contentWidth.title"
        options={CONTENT_WIDTH_OPTIONS}
        value={contentWidth}
        onChange={setContentWidth}
      />
      <Section title={t("settings.preview.title")}>
        <VStack gap="md">
          <HStack gap="sm" align="center" wrap>
            <Button variant="primary">{t("settings.preview.primary")}</Button>
            <Button variant="secondary">{t("settings.preview.secondary")}</Button>
          </HStack>
          <HStack gap="sm" align="center" wrap>
            <Button variant="subtle" onClick={resetThemeSettings}>
              {t("settings.reset")}
            </Button>
          </HStack>
        </VStack>
      </Section>
    </VStack>
  );
}
