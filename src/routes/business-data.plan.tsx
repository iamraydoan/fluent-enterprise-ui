import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { PlanListPage } from "@/features/business-data/entities/plan/PlanListPage";

function PlanRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/plan") return <PlanListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/plan")({
  component: PlanRoute,
});
