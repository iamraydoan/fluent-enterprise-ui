import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { StepListPage } from "@/features/business-data/entities/step/StepListPage";

function StepRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/step") return <StepListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/step")({
  component: StepRoute,
});
