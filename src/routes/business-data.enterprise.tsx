import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { EnterpriseListPage } from "@/features/business-data/entities/enterprise/EnterpriseListPage";

function EnterpriseRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/enterprise") return <EnterpriseListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/enterprise")({
  component: EnterpriseRoute,
});
