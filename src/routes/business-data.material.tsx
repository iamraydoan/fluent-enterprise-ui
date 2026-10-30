import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { MaterialListPage } from "@/features/business-data/entities/material/MaterialListPage";

function MaterialRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/material") return <MaterialListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/material")({
  component: MaterialRoute,
});
