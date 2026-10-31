import { createFileRoute } from "@tanstack/react-router";
import { ParameterDetailPage } from "@/features/business-data/parameter/ParameterDetailPage";

function ParameterDetailRoute() {
  const { name } = Route.useParams();
  return <ParameterDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/parameter/$name")({
  component: ParameterDetailRoute,
});
