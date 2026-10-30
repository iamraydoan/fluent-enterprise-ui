import { createFileRoute } from "@tanstack/react-router";
import { PlanDetailPage } from "@/features/business-data/entities/plan/PlanDetailPage";

function PlanDetailRoute() {
  const { name } = Route.useParams();
  return <PlanDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/plan/$name")({
  component: PlanDetailRoute,
});
