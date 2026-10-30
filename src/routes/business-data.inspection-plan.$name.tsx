import { createFileRoute } from "@tanstack/react-router";
import { InspectionPlanDetailPage } from "@/features/business-data/entities/inspection-plan/InspectionPlanDetailPage";

function InspectionPlanDetailRoute() {
  const { name } = Route.useParams();
  return <InspectionPlanDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/inspection-plan/$name")({
  component: InspectionPlanDetailRoute,
});
