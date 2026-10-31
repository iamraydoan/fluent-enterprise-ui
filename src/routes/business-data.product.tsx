import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ProductListPage } from "@/features/business-data/product/ProductListPage";

function ProductRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/product") return <ProductListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/product")({
  component: ProductRoute,
});
