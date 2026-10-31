import { useNavigate } from "@tanstack/react-router";
import { HubPage } from "@/components/common";
import { BarcodeScanner24Regular } from "@/components/icons";
import type { TranslationKey } from "@/i18n";
import { useTabsStore } from "@/stores/tabs-store";

const L: Record<string, TranslationKey> = {
  ariaLabel: "nav.sections.manufacturing",
  tile: "manufacturing.barcodeIdentification.pageTitle",
};

const TILES = [
  {
    id: "barcode-identification",
    labelKey: L.tile,
    icon: <BarcodeScanner24Regular />,
    route: "/manufacturing/barcode-identification",
  },
];

export function ManufacturingHubPage() {
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();

  return (
    <HubPage
      tiles={TILES}
      ariaLabelKey={L.ariaLabel}
      onTileClick={(route) => {
        openRoute(route);
        navigate({ to: route });
      }}
    />
  );
}
