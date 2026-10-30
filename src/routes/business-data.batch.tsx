import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { BatchListPage } from "@/features/business-data/entities/batch/BatchListPage";

function BatchRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/batch") return <BatchListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/batch")({
  component: BatchRoute,
});
