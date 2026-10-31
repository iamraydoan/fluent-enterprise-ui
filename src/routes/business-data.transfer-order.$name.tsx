import { createFileRoute } from "@tanstack/react-router";
import { TransferOrderDetailPage } from "@/features/business-data/transfer-order/TransferOrderDetailPage";

function TransferOrderDetailRoute() {
  const { name } = Route.useParams();
  return <TransferOrderDetailPage name={decodeURIComponent(name)} />;
}

export const Route = createFileRoute("/business-data/transfer-order/$name")({
  component: TransferOrderDetailRoute,
});
