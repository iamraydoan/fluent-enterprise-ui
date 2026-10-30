import { createFileRoute } from "@tanstack/react-router";
import { SubstrateMapDetailPage } from "@/features/business-data/entities/substrate-map/SubstrateMapDetailPage";

function SubstrateMapDetailRoute() {
  const { name } = Route.useParams();
  return <SubstrateMapDetailPage name={decodeURIComponent(name)} />;
}

export const Route = createFileRoute("/business-data/substrate-map/$name")({
  component: SubstrateMapDetailRoute,
});
