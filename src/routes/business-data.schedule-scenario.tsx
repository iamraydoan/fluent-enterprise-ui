import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ScheduleScenarioListPage } from "@/features/business-data/schedule-scenario/ScheduleScenarioListPage";

function ScheduleScenarioRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/schedule-scenario") return <ScheduleScenarioListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/schedule-scenario")({
  component: ScheduleScenarioRoute,
});
