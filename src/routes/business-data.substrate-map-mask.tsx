import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { SubstrateMapMaskListPage } from "@/features/business-data/entities/substrate-map-mask/SubstrateMapMaskListPage";

function SubstrateMapMaskRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/substrate-map-mask") return <SubstrateMapMaskListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/substrate-map-mask")({
  component: SubstrateMapMaskRoute,
});
