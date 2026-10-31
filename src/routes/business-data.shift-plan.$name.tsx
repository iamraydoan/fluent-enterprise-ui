import { createFileRoute } from "@tanstack/react-router";
import { ShiftPlanDetailPage } from "@/features/business-data/shift-plan/ShiftPlanDetailPage";

function ShiftPlanDetailRoute() {
  const { name } = Route.useParams();
  return <ShiftPlanDetailPage name={decodeURIComponent(name)} />;
}

export const Route = createFileRoute("/business-data/shift-plan/$name")({
  component: ShiftPlanDetailRoute,
});
