import { createFileRoute } from "@tanstack/react-router";
import { FabLiveDetailPage } from "@/features/manufacturing/fab-lives/FabLiveDetailPage";

function FabLiveDetailRoute() {
  const { name } = Route.useParams();
  return <FabLiveDetailPage name={decodeURIComponent(name)} />;
}

export const Route = createFileRoute("/manufacturing/fab-lives/$name")({
  component: FabLiveDetailRoute,
});
