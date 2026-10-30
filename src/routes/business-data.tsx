import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { BusinessDataHubPage } from "@/features/business-data/BusinessDataHubPage";

function BusinessDataRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data") return <BusinessDataHubPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data")({
  component: BusinessDataRoute,
});
