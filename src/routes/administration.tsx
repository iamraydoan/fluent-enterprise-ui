import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { AdministrationHubPage } from "@/features/administration/AdministrationHubPage";

function AdministrationRoute() {
  const location = useLocation();
  if (location.pathname === "/administration") return <AdministrationHubPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/administration")({
  component: AdministrationRoute,
});
