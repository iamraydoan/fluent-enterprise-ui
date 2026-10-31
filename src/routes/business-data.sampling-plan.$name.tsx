import { createFileRoute } from "@tanstack/react-router";
import { SamplingPlanDetailPage } from "@/features/business-data/sampling-plan/SamplingPlanDetailPage";

function SamplingPlanDetailRoute() {
  const { name } = Route.useParams();
  return <SamplingPlanDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/sampling-plan/$name")({
  component: SamplingPlanDetailRoute,
});
