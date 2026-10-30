import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { QueriesPage } from "@/features/queries/QueriesPage";

function QueriesRoute() {
  const location = useLocation();
  if (location.pathname === "/administration/queries") return <QueriesPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/administration/queries")({
  component: QueriesRoute,
});
