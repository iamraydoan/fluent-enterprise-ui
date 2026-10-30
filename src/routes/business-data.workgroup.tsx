import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { WorkgroupListPage } from "@/features/business-data/entities/workgroup/WorkgroupListPage";

function WorkgroupRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/workgroup") return <WorkgroupListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/workgroup")({
  component: WorkgroupRoute,
});
