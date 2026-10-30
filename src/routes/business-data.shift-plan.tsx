import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ShiftPlanListPage } from "@/features/business-data/entities/shift-plan/ShiftPlanListPage";

function ShiftPlanRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/shift-plan") return <ShiftPlanListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/shift-plan")({
  component: ShiftPlanRoute,
});
