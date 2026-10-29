import { createFileRoute } from "@tanstack/react-router";
import { getAdministrationTile } from "@/data/navigation";
import { PlaceholderPage } from "@/features/administration/PlaceholderPage";

function AdministrationTileRoute() {
  const { tile } = Route.useParams();
  const tileDef = getAdministrationTile(tile);
  if (!tileDef) {
    return <PlaceholderPage title="Page not found" body="This page does not exist." />;
  }
  return <PlaceholderPage title={tileDef.label} body="This page is not yet implemented" />;
}

export const Route = createFileRoute("/administration/$tile")({
  component: AdministrationTileRoute,
});
