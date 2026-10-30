import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ExperimentDefinitionListPage } from "@/features/business-data/entities/experiment-definition/ExperimentDefinitionListPage";

function ExperimentDefinitionRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/experiment-definition")
    return <ExperimentDefinitionListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/experiment-definition")({
  component: ExperimentDefinitionRoute,
});
