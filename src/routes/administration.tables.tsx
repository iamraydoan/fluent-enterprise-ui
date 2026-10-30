import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { TablesHubPage } from "@/features/generic-tables/TablesHubPage";

function GenericTablesRoute() {
  const location = useLocation();
  if (location.pathname === "/administration/tables") return <TablesHubPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/administration/tables")({
  component: GenericTablesRoute,
});
