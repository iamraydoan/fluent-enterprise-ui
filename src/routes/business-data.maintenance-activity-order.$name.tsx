import { createFileRoute } from "@tanstack/react-router";
import { MaintenanceActivityOrderDetailPage } from "@/features/business-data/maintenance-activity-order/MaintenanceActivityOrderDetailPage";

function MaintenanceActivityOrderDetailRoute() {
  const { name } = Route.useParams();
  return <MaintenanceActivityOrderDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/maintenance-activity-order/$name")({
  component: MaintenanceActivityOrderDetailRoute,
});
