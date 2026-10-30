import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { TaskListPage } from "@/features/business-data/entities/task/TaskListPage";

function TaskRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/task") return <TaskListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/task")({
  component: TaskRoute,
});
