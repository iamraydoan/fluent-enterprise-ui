import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { KpiListPage } from "@/features/business-data/entities/kpi/KpiListPage";

function KpiRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/kpi") return <KpiListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/kpi")({
  component: KpiRoute,
});
