import { createFileRoute } from "@tanstack/react-router";
import { StepDetailPage } from "@/features/business-data/entities/step/StepDetailPage";

function StepDetailRoute() {
  const { name } = Route.useParams();
  return <StepDetailPage name={decodeURIComponent(name)} />;
}

export const Route = createFileRoute("/business-data/step/$name")({
  component: StepDetailRoute,
});
