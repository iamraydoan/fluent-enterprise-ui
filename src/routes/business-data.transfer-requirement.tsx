import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { TransferRequirementListPage } from "@/features/business-data/entities/transfer-requirement/TransferRequirementListPage";

function TransferRequirementRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/transfer-requirement") return <TransferRequirementListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/transfer-requirement")({
  component: TransferRequirementRoute,
});
