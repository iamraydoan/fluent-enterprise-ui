import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { MaintenanceActivityOrderListPage } from "@/features/business-data/maintenance-activity-order/MaintenanceActivityOrderListPage";

function MaintenanceActivityOrderRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/maintenance-activity-order")
    return <MaintenanceActivityOrderListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/maintenance-activity-order")({
  component: MaintenanceActivityOrderRoute,
});
