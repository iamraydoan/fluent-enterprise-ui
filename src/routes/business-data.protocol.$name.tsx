import { createFileRoute } from "@tanstack/react-router";
import { ProtocolDetailPage } from "@/features/business-data/entities/protocol/ProtocolDetailPage";

function ProtocolDetailRoute() {
  const { name } = Route.useParams();
  return <ProtocolDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/protocol/$name")({
  component: ProtocolDetailRoute,
});
