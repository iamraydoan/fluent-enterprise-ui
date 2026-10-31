import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ManufacturingHubPage } from "@/features/manufacturing/ManufacturingHubPage";

function ManufacturingRoute() {
  const location = useLocation();
  if (location.pathname === "/manufacturing") return <ManufacturingHubPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/manufacturing")({
  component: ManufacturingRoute,
});
