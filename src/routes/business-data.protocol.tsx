import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ProtocolListPage } from "@/features/business-data/protocol/ProtocolListPage";

function ProtocolRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/protocol") return <ProtocolListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/protocol")({
  component: ProtocolRoute,
});
