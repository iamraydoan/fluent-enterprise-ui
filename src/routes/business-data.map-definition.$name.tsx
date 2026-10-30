import { createFileRoute } from "@tanstack/react-router";
import { MapDefinitionDetailPage } from "@/features/business-data/entities/map-definition/MapDefinitionDetailPage";

function MapDefinitionDetailRoute() {
  const { name } = Route.useParams();
  return <MapDefinitionDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/map-definition/$name")({
  component: MapDefinitionDetailRoute,
});
