import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ServiceListPage } from "@/features/business-data/service/ServiceListPage";

function ServiceRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/service") return <ServiceListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/service")({
  component: ServiceRoute,
});
