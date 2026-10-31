import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { SiteListPage } from "@/features/business-data/site/SiteListPage";

function SiteRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/site") return <SiteListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/site")({
  component: SiteRoute,
});
