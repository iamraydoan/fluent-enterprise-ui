import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/features/business-data/entities/service/ServiceDetailPage";

function ServiceDetailRoute() {
  const { name } = Route.useParams();
  return <ServiceDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/service/$name")({
  component: ServiceDetailRoute,
});
