import { createRootRoute, useNavigate } from "@tanstack/react-router";
import { Button, FluentProvider, Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { MainLayout } from "@/layouts/MainLayout";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/theme";

function NotFound() {
  const sharedStyles = useSharedStyles();
  const navigate = useNavigate();
  const { t } = useAppTranslation();
  return (
    <section className={sharedStyles.contentCard} aria-label={t("placeholder.notFoundTitle")}>
      <Text weight="semibold" size={400}>
        {t("placeholder.notFoundTitle")}
      </Text>
      <Button appearance="primary" onClick={() => navigate({ to: "/administration" })}>
        {t("mainLayout.openAdministration")}
      </Button>
    </section>
  );
}

export const Route = createRootRoute({
  component: () => (
    <FluentProvider theme={theme} style={{ height: "100vh" }}>
      <MainLayout />
    </FluentProvider>
  ),
  notFoundComponent: NotFound,
});
