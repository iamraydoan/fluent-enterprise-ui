import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { AreaListPage } from "@/features/business-data/area/AreaListPage";

function AreaRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/area") return <AreaListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/area")({
  component: AreaRoute,
});
