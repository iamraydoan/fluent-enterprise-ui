import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { DataCollectionLimitSetListPage } from "@/features/business-data/data-collection-limit-set/DataCollectionLimitSetListPage";

function DataCollectionLimitSetRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/data-collection-limit-set")
    return <DataCollectionLimitSetListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/data-collection-limit-set")({
  component: DataCollectionLimitSetRoute,
});
