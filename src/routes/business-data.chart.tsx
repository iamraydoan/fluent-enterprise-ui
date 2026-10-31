import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ChartListPage } from "@/features/business-data/chart/ChartListPage";

function ChartRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/chart") return <ChartListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/chart")({
  component: ChartRoute,
});
