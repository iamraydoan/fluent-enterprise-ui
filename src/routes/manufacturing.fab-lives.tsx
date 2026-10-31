import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { FabLiveListPage } from "@/features/manufacturing/fab-lives/FabLiveListPage";

function FabLivesRoute() {
  const location = useLocation();
  if (location.pathname === "/manufacturing/fab-lives") return <FabLiveListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/manufacturing/fab-lives")({
  component: FabLivesRoute,
});
