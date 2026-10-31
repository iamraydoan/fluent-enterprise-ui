import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ProductionOrderListPage } from "@/features/business-data/production-order/ProductionOrderListPage";

function ProductionOrderRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/production-order") return <ProductionOrderListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/production-order")({
  component: ProductionOrderRoute,
});
