import { createFileRoute } from "@tanstack/react-router";
import { KpiDetailPage } from "@/features/business-data/kpi/KpiDetailPage";

function KpiDetailRoute() {
  const { name } = Route.useParams();
  return <KpiDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/kpi/$name")({
  component: KpiDetailRoute,
});
