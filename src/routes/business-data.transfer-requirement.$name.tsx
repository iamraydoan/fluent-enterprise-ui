import { createFileRoute } from "@tanstack/react-router";
import { TransferRequirementDetailPage } from "@/features/business-data/entities/transfer-requirement/TransferRequirementDetailPage";

function TransferRequirementDetailRoute() {
  const { name } = Route.useParams();
  return <TransferRequirementDetailPage name={decodeURIComponent(name)} />;
}

export const Route = createFileRoute("/business-data/transfer-requirement/$name")({
  component: TransferRequirementDetailRoute,
});
