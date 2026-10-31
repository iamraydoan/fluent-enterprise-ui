import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { DataCollectionListPage } from "@/features/business-data/data-collection/DataCollectionListPage";

function DataCollectionRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/data-collection") return <DataCollectionListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/data-collection")({
  component: DataCollectionRoute,
});
