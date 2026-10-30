import { createFileRoute } from "@tanstack/react-router";
import { ResourceJobDetailPage } from "@/features/business-data/entities/resource-job/ResourceJobDetailPage";

function ResourceJobDetailRoute() {
  const { name } = Route.useParams();
  return <ResourceJobDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/resource-job/$name")({
  component: ResourceJobDetailRoute,
});
