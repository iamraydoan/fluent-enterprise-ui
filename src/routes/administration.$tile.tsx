import { createFileRoute } from "@tanstack/react-router";
import { getAdministrationTile } from "@/data/navigation";
import { PlaceholderPage } from "@/features/administration/PlaceholderPage";
import { useAppTranslation } from "@/i18n";

function AdministrationTileRoute() {
  const { tile } = Route.useParams();
  const { t } = useAppTranslation();
  const tileDef = getAdministrationTile(tile);
  if (!tileDef) {
    return (
      <PlaceholderPage
        title={t("placeholder.notFoundTitle")}
        body={t("placeholder.notFoundBody")}
      />
    );
  }
  return <PlaceholderPage title={t(tileDef.labelKey)} icon={tileDef.icon} />;
}

export const Route = createFileRoute("/administration/$tile")({
  component: AdministrationTileRoute,
});
