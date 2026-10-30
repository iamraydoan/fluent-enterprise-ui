import { createFileRoute } from "@tanstack/react-router";
import { MaterialTransferDetailPage } from "@/features/business-data/entities/material-transfer/MaterialTransferDetailPage";

function MaterialTransferDetailRoute() {
  const { name } = Route.useParams();
  return <MaterialTransferDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/material-transfer/$name")({
  component: MaterialTransferDetailRoute,
});
