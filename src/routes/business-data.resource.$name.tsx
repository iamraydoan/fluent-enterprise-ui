import { createFileRoute } from "@tanstack/react-router";
import { ResourceDetailPage } from "@/features/business-data/entities/resource/ResourceDetailPage";

function ResourceDetailRoute() {
  const { name } = Route.useParams();
  return <ResourceDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/resource/$name")({
  component: ResourceDetailRoute,
});
