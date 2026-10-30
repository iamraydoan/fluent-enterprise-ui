import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { MaintenancePlanListPage } from "@/features/business-data/entities/maintenance-plan/MaintenancePlanListPage";

function MaintenancePlanRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/maintenance-plan") return <MaintenancePlanListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/maintenance-plan")({
  component: MaintenancePlanRoute,
});
