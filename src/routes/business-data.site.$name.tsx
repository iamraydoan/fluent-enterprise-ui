import { createFileRoute } from "@tanstack/react-router";
import { SiteDetailPage } from "@/features/business-data/site/SiteDetailPage";

function SiteDetailRoute() {
  const { name } = Route.useParams();
  return <SiteDetailPage name={decodeURIComponent(name)} />;
}

export const Route = createFileRoute("/business-data/site/$name")({
  component: SiteDetailRoute,
});
