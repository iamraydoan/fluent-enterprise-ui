import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ConfigurationListPage } from "@/features/administration/configuration/ConfigurationListPage";

function ConfigurationRoute() {
  const location = useLocation();
  if (location.pathname === "/administration/configuration") return <ConfigurationListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/administration/configuration")({
  component: ConfigurationRoute,
});
