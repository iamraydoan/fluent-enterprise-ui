import { createFileRoute } from "@tanstack/react-router";
import { TaskDetailPage } from "@/features/business-data/entities/task/TaskDetailPage";

function TaskDetailRoute() {
  const { name } = Route.useParams();
  return <TaskDetailPage name={decodeURIComponent(name)} />;
}

export const Route = createFileRoute("/business-data/task/$name")({
  component: TaskDetailRoute,
});
