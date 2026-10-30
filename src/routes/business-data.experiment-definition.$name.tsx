import { createFileRoute } from "@tanstack/react-router";
import { ExperimentDefinitionDetailPage } from "@/features/business-data/entities/experiment-definition/ExperimentDefinitionDetailPage";

function ExperimentDefinitionDetailRoute() {
  const { name } = Route.useParams();
  return <ExperimentDefinitionDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/experiment-definition/$name")({
  component: ExperimentDefinitionDetailRoute,
});
