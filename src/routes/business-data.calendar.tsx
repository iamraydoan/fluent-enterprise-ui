import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { CalendarListPage } from "@/features/business-data/calendar/CalendarListPage";

function CalendarRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/calendar") return <CalendarListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/calendar")({
  component: CalendarRoute,
});
