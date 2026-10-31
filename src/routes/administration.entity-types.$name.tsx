import { createFileRoute } from "@tanstack/react-router";
import { EntityTypeDetailPage } from "@/features/administration/entity-types/EntityTypeDetailPage";

function EntityTypeDetailRoute() {
  const { name } = Route.useParams();
  return <EntityTypeDetailPage name={name} />;
}

export const Route = createFileRoute("/administration/entity-types/$name")({
  component: EntityTypeDetailRoute,
});
