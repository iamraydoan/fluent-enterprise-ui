import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ResourceJobListPage } from "@/features/business-data/entities/resource-job/ResourceJobListPage";

function ResourceJobRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/resource-job") return <ResourceJobListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/resource-job")({
  component: ResourceJobRoute,
});
