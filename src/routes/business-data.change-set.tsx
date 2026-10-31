import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ChangeSetListPage } from "@/features/business-data/change-set/ChangeSetListPage";

function ChangeSetRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/change-set") return <ChangeSetListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/change-set")({
  component: ChangeSetRoute,
});
