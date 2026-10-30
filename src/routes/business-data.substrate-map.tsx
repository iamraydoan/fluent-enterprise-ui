import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { SubstrateMapListPage } from "@/features/business-data/entities/substrate-map/SubstrateMapListPage";

function SubstrateMapRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/substrate-map") return <SubstrateMapListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/substrate-map")({
  component: SubstrateMapRoute,
});
