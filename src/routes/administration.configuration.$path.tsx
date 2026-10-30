import { createFileRoute } from "@tanstack/react-router";
import { ConfigurationDetailPage } from "@/features/configuration/ConfigurationDetailPage";

function ConfigurationDetailRoute() {
  const { path } = Route.useParams();
  return <ConfigurationDetailPage path={path} />;
}

export const Route = createFileRoute("/administration/configuration/$path")({
  component: ConfigurationDetailRoute,
});
