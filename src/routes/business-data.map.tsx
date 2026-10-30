import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { MapListPage } from "@/features/business-data/entities/map/MapListPage";

function MapRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/map") return <MapListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/map")({
  component: MapRoute,
});
