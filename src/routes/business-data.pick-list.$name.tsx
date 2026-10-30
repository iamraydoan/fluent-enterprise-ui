import { createFileRoute } from "@tanstack/react-router";
import { PickListDetailPage } from "@/features/business-data/entities/pick-list/PickListDetailPage";

function PickListDetailRoute() {
  const { name } = Route.useParams();
  return <PickListDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/pick-list/$name")({
  component: PickListDetailRoute,
});
