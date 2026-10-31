import { createFileRoute } from "@tanstack/react-router";
import { ScheduleDetailPage } from "@/features/business-data/schedule/ScheduleDetailPage";

function ScheduleDetailRoute() {
  const { name } = Route.useParams();
  return <ScheduleDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/schedule/$name")({
  component: ScheduleDetailRoute,
});
