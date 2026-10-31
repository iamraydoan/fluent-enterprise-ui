import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { TransferOrderListPage } from "@/features/business-data/transfer-order/TransferOrderListPage";

function TransferOrderRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/transfer-order") return <TransferOrderListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/transfer-order")({
  component: TransferOrderRoute,
});
