import { createFileRoute } from "@tanstack/react-router";
import { ScheduleScenarioDetailPage } from "@/features/business-data/entities/schedule-scenario/ScheduleScenarioDetailPage";

function ScheduleScenarioDetailRoute() {
  const { name } = Route.useParams();
  return <ScheduleScenarioDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/schedule-scenario/$name")({
  component: ScheduleScenarioDetailRoute,
});
