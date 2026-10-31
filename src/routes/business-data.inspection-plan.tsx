import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { InspectionPlanListPage } from "@/features/business-data/inspection-plan/InspectionPlanListPage";

function InspectionPlanRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/inspection-plan") return <InspectionPlanListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/inspection-plan")({
  component: InspectionPlanRoute,
});
