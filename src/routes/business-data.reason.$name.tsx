import { createFileRoute } from "@tanstack/react-router";
import { ReasonDetailPage } from "@/features/business-data/entities/reason/ReasonDetailPage";

function ReasonDetailRoute() {
  const { name } = Route.useParams();
  return <ReasonDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/reason/$name")({
  component: ReasonDetailRoute,
});
