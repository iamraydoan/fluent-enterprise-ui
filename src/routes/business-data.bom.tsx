import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { BomListPage } from "@/features/business-data/entities/bom/BomListPage";

function BomRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/bom") return <BomListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/bom")({
  component: BomRoute,
});
