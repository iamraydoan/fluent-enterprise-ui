import { createFileRoute } from "@tanstack/react-router";
import { QueryDetailPage } from "@/features/queries/QueryDetailPage";

function QueryDetailRoute() {
  const { name } = Route.useParams();
  return <QueryDetailPage name={name} />;
}

export const Route = createFileRoute("/administration/queries/$name")({
  component: QueryDetailRoute,
});
