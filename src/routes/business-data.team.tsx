import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { TeamListPage } from "@/features/business-data/team/TeamListPage";

function TeamRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/team") return <TeamListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/team")({
  component: TeamRoute,
});
