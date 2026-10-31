import { createFileRoute } from "@tanstack/react-router";
import { SubstrateMapMaskDetailPage } from "@/features/business-data/substrate-map-mask/SubstrateMapMaskDetailPage";

function SubstrateMapMaskDetailRoute() {
  const { name } = Route.useParams();
  return <SubstrateMapMaskDetailPage name={decodeURIComponent(name)} />;
}

export const Route = createFileRoute("/business-data/substrate-map-mask/$name")({
  component: SubstrateMapMaskDetailRoute,
});
