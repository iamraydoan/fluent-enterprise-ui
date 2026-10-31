import { createFileRoute } from "@tanstack/react-router";
import { ProductDetailPage } from "@/features/business-data/product/ProductDetailPage";

function ProductDetailRoute() {
  const { name } = Route.useParams();
  return <ProductDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/product/$name")({
  component: ProductDetailRoute,
});
