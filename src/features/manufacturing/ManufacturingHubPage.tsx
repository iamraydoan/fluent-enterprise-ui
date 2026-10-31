import { useNavigate } from "@tanstack/react-router";
import { HubPage } from "@/components/common";
import { MANUFACTURING_PAGES } from "@/data/navigation";
import type { TranslationKey } from "@/i18n";
import { useTabsStore } from "@/stores/tabs-store";

const L: Record<string, TranslationKey> = {
  ariaLabel: "nav.sections.manufacturing",
};

export function ManufacturingHubPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();

  return (
    <HubPage
      tiles={MANUFACTURING_PAGES}
      ariaLabelKey={L.ariaLabel}
      searchWidth={280}
      onTileClick={(route) => {
        openRoute(route);
        navigate({ to: route });
      }}
    />
  );
}
