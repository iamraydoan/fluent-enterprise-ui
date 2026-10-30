import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ParameterListPage } from "@/features/business-data/entities/parameter/ParameterListPage";

function ParameterRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/parameter") return <ParameterListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/parameter")({
  component: ParameterRoute,
});
