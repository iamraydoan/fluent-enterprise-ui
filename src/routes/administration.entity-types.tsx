import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { EntityTypesListPage } from "@/features/entity-types/EntityTypesListPage";

function EntityTypesRoute() {
  const location = useLocation();
  if (location.pathname === "/administration/entity-types") return <EntityTypesListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/administration/entity-types")({
  component: EntityTypesRoute,
});
