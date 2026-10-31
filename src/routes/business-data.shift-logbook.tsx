import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ShiftLogbookListPage } from "@/features/business-data/shift-logbook/ShiftLogbookListPage";

function ShiftLogbookRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/shift-logbook") return <ShiftLogbookListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/shift-logbook")({
  component: ShiftLogbookRoute,
});
