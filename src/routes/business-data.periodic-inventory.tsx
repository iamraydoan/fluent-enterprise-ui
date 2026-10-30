import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { PeriodicInventoryListPage } from "@/features/business-data/entities/periodic-inventory/PeriodicInventoryListPage";

function PeriodicInventoryRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/periodic-inventory")
    return <PeriodicInventoryListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/periodic-inventory")({
  component: PeriodicInventoryRoute,
});
