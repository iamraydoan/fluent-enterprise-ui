import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ReasonListPage } from "@/features/business-data/entities/reason/ReasonListPage";

function ReasonRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/reason") return <ReasonListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/reason")({
  component: ReasonRoute,
});
