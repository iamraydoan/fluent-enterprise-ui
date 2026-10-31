import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ResourceListPage } from "@/features/business-data/resource/ResourceListPage";

function ResourceRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/resource") return <ResourceListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/resource")({
  component: ResourceRoute,
});
