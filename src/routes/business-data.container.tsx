import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ContainerListPage } from "@/features/business-data/container/ContainerListPage";

function ContainerRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/container") return <ContainerListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/container")({
  component: ContainerRoute,
});
