import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { FlowListPage } from "@/features/business-data/flow/FlowListPage";

function FlowRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/flow") return <FlowListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/flow")({
  component: FlowRoute,
});
