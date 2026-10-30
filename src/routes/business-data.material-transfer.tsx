import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { MaterialTransferListPage } from "@/features/business-data/entities/material-transfer/MaterialTransferListPage";

function MaterialTransferRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/material-transfer") return <MaterialTransferListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/material-transfer")({
  component: MaterialTransferRoute,
});
