import { useNavigate } from "@tanstack/react-router";
import { HubPage } from "@/components/common";
import { ADMINISTRATION_TILES } from "@/data/navigation";
import type { TranslationKey } from "@/i18n";
import { useTabsStore } from "@/stores/tabs-store";

const L: Record<string, TranslationKey> = {
  ariaLabel: "nav.sections.administration",
};

export function AdministrationHubPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();

  return (
    <HubPage
      tiles={ADMINISTRATION_TILES}
      ariaLabelKey={L.ariaLabel}
      onTileClick={(route) => {
        openRoute(route);
        navigate({ to: route });
      }}
    />
  );
}
