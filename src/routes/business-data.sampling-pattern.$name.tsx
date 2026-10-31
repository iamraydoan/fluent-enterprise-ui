import { createFileRoute } from "@tanstack/react-router";
import { SamplingPatternDetailPage } from "@/features/business-data/sampling-pattern/SamplingPatternDetailPage";

function SamplingPatternDetailRoute() {
  const { name } = Route.useParams();
  return <SamplingPatternDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/sampling-pattern/$name")({
  component: SamplingPatternDetailRoute,
});
