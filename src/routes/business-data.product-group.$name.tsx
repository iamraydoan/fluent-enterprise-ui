import { createFileRoute } from "@tanstack/react-router";
import { ProductGroupDetailPage } from "@/features/business-data/entities/product-group/ProductGroupDetailPage";

function ProductGroupDetailRoute() {
  const { name } = Route.useParams();
  return <ProductGroupDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/product-group/$name")({
  component: ProductGroupDetailRoute,
});
