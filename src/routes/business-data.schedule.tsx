import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ScheduleListPage } from "@/features/business-data/schedule/ScheduleListPage";

function ScheduleRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/schedule") return <ScheduleListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/schedule")({
  component: ScheduleRoute,
});
