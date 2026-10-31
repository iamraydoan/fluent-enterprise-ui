import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { PackageListPage } from "@/features/business-data/package/PackageListPage";

function PackageRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/package") return <PackageListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/package")({
  component: PackageRoute,
});
