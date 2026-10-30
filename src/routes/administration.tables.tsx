import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { GenericTablesListPage } from "@/features/generic-tables/GenericTablesListPage";

function GenericTablesRoute() {
  const location = useLocation();
  if (location.pathname === "/administration/tables") return <GenericTablesListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/administration/tables")({
  component: GenericTablesRoute,
});
