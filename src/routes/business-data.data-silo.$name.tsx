import { createFileRoute } from "@tanstack/react-router";
import { DataSiloDetailPage } from "@/features/business-data/data-silo/DataSiloDetailPage";

function DataSiloDetailRoute() {
  const { name } = Route.useParams();
  return <DataSiloDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/data-silo/$name")({
  component: DataSiloDetailRoute,
});
