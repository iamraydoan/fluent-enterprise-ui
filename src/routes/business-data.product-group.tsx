import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ProductGroupListPage } from "@/features/business-data/product-group/ProductGroupListPage";

function ProductGroupRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/product-group") return <ProductGroupListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/product-group")({
  component: ProductGroupRoute,
});
