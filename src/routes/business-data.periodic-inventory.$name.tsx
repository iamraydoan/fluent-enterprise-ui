import { createFileRoute } from "@tanstack/react-router";
import { PeriodicInventoryDetailPage } from "@/features/business-data/periodic-inventory/PeriodicInventoryDetailPage";

function PeriodicInventoryDetailRoute() {
  const { name } = Route.useParams();
  return <PeriodicInventoryDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/periodic-inventory/$name")({
  component: PeriodicInventoryDetailRoute,
});
