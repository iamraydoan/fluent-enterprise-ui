import { createRootRoute, useNavigate } from "@tanstack/react-router";
import { Button, FluentProvider, Text } from "@/components/ui";
import { MainLayout } from "@/layouts/MainLayout";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/theme";

function NotFound() {
  const sharedStyles = useSharedStyles();
  const navigate = useNavigate();
  return (
    <section className={sharedStyles.contentCard} aria-label="Page not found">
      <Text weight="semibold" size={400}>
        Page not found
      </Text>
      <Button appearance="primary" onClick={() => navigate({ to: "/entity-types" })}>
        Open Entity Types
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
