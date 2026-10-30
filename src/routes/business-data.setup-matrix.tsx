import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { SetupMatrixListPage } from "@/features/business-data/entities/setup-matrix/SetupMatrixListPage";

function SetupMatrixRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/setup-matrix") return <SetupMatrixListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/setup-matrix")({
  component: SetupMatrixRoute,
});
