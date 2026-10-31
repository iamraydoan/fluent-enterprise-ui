import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { SendAheadRunListPage } from "@/features/business-data/send-ahead-run/SendAheadRunListPage";

function SendAheadRunRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/send-ahead-run") return <SendAheadRunListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/send-ahead-run")({
  component: SendAheadRunRoute,
});
