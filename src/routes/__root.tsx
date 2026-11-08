import { createRootRoute, useNavigate } from "@tanstack/react-router";
import { Button, FluentProvider, Text } from "@/components/ui";
import { useThemeSettingsTheme } from "@/features/settings/theme-settings-context";
import { ThemeSettingsProvider } from "@/features/settings/theme-settings-provider";
import { useAppTranslation } from "@/i18n";
import { MainLayout } from "@/layouts/MainLayout";
import { useSharedStyles } from "@/styles/shared";

function RootLayout() {
  const appTheme = useThemeSettingsTheme();
  return (
    <FluentProvider theme={appTheme} style={{ height: "100vh" }}>
      <MainLayout />
    </FluentProvider>
  );
}

function NotFound() {
  const sharedStyles = useSharedStyles();
  const navigate = useNavigate();
  const { t } = useAppTranslation();
  return (
    <section className={sharedStyles.contentCard} aria-label={t("placeholder.notFoundTitle")}>
      <Text weight="semibold" size={400}>
        {t("placeholder.notFoundTitle")}
      </Text>
      <Button variant="primary" onClick={() => navigate({ to: "/administration" })}>
        {t("mainLayout.openAdministration")}
      </Button>
    </section>
  );
}

export const Route = createRootRoute({
  component: () => (
    <ThemeSettingsProvider>
      <RootLayout />
    </ThemeSettingsProvider>
  ),
  notFoundComponent: NotFound,
});
