import { createFileRoute } from "@tanstack/react-router";
import { MaintenancePlanDetailPage } from "@/features/business-data/entities/maintenance-plan/MaintenancePlanDetailPage";

function MaintenancePlanDetailRoute() {
  const { name } = Route.useParams();
  return <MaintenancePlanDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/maintenance-plan/$name")({
  component: MaintenancePlanDetailRoute,
});
