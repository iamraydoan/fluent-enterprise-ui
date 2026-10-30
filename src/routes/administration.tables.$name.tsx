import { createFileRoute } from "@tanstack/react-router";
import { GenericTableDetailPage } from "@/features/generic-tables/GenericTableDetailPage";

function GenericTableDetailRoute() {
  const { name } = Route.useParams();
  return <GenericTableDetailPage name={name} />;
}

export const Route = createFileRoute("/administration/tables/$name")({
  component: GenericTableDetailRoute,
});
