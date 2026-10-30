import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ShiftDefinitionListPage } from "@/features/business-data/entities/shift-definition/ShiftDefinitionListPage";

function ShiftDefinitionRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/shift-definition") return <ShiftDefinitionListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/shift-definition")({
  component: ShiftDefinitionRoute,
});
