import { createFileRoute } from "@tanstack/react-router";
import { ProductionOrderDetailPage } from "@/features/business-data/entities/production-order/ProductionOrderDetailPage";

function ProductionOrderDetailRoute() {
  const { name } = Route.useParams();
  return <ProductionOrderDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/production-order/$name")({
  component: ProductionOrderDetailRoute,
});
