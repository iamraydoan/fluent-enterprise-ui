import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { FacilityListPage } from "@/features/business-data/entities/facility/FacilityListPage";

function FacilityRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/facility") return <FacilityListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/facility")({
  component: FacilityRoute,
});
