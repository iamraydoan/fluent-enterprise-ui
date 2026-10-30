import { createFileRoute } from "@tanstack/react-router";
import { TeamDetailPage } from "@/features/business-data/entities/team/TeamDetailPage";

function TeamDetailRoute() {
  const { name } = Route.useParams();
  return <TeamDetailPage name={decodeURIComponent(name)} />;
}

export const Route = createFileRoute("/business-data/team/$name")({
  component: TeamDetailRoute,
});
