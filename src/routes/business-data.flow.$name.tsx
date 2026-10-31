import { createFileRoute } from "@tanstack/react-router";
import { FlowDetailPage } from "@/features/business-data/flow/FlowDetailPage";

function FlowDetailRoute() {
  const { name } = Route.useParams();
  return <FlowDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/flow/$name")({
  component: FlowDetailRoute,
});
