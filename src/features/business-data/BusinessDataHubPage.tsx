import { useNavigate } from "@tanstack/react-router";
import { HubPage } from "@/components/common";
import { BUSINESS_DATA_ENTITIES } from "@/data/navigation";
import type { TranslationKey } from "@/i18n";
import { useTabsStore } from "@/stores/tabs-store";

const L: Record<string, TranslationKey> = {
  ariaLabel: "nav.sections.businessData",
};

export function BusinessDataHubPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();

  return (
    <HubPage
      tiles={BUSINESS_DATA_ENTITIES}
      ariaLabelKey={L.ariaLabel}
      searchWidth={280}
      onTileClick={(route) => {
        openRoute(route);
        navigate({ to: route });
      }}
    />
  );
}
