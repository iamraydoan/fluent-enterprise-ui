import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { MapDefinitionListPage } from "@/features/business-data/entities/map-definition/MapDefinitionListPage";

function MapDefinitionRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/map-definition") return <MapDefinitionListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/map-definition")({
  component: MapDefinitionRoute,
});
