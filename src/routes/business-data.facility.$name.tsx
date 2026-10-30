import { createFileRoute } from "@tanstack/react-router";
import { FacilityDetailPage } from "@/features/business-data/entities/facility/FacilityDetailPage";

function FacilityDetailRoute() {
  const { name } = Route.useParams();
  return <FacilityDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/facility/$name")({
  component: FacilityDetailRoute,
});
