import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { PickListListPage } from "@/features/business-data/entities/pick-list/PickListListPage";

function PickListRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/pick-list") return <PickListListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/pick-list")({
  component: PickListRoute,
});
