import { createFileRoute } from "@tanstack/react-router";
import { MapDetailPage } from "@/features/business-data/entities/map/MapDetailPage";

function MapDetailRoute() {
  const { name } = Route.useParams();
  return <MapDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/map/$name")({
  component: MapDetailRoute,
});
