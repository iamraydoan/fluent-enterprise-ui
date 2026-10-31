import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { SamplingPlanListPage } from "@/features/business-data/sampling-plan/SamplingPlanListPage";

function SamplingPlanRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/sampling-plan") return <SamplingPlanListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/sampling-plan")({
  component: SamplingPlanRoute,
});
