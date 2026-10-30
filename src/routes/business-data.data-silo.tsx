import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { DataSiloListPage } from "@/features/business-data/entities/data-silo/DataSiloListPage";

function DataSiloRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/data-silo") return <DataSiloListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/data-silo")({
  component: DataSiloRoute,
});
