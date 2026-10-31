import { createFileRoute } from "@tanstack/react-router";
import { MaterialTransferDetailPage } from "@/features/business-data/material-transfer/MaterialTransferDetailPage";

function MaterialTransferDetailRoute() {
  const { name } = Route.useParams();
  return <MaterialTransferDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/material-transfer/$name")({
  component: MaterialTransferDetailRoute,
});
