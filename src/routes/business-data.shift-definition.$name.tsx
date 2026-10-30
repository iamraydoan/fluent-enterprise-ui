import { createFileRoute } from "@tanstack/react-router";
import { ShiftDefinitionDetailPage } from "@/features/business-data/entities/shift-definition/ShiftDefinitionDetailPage";

function ShiftDefinitionDetailRoute() {
  const { name } = Route.useParams();
  return <ShiftDefinitionDetailPage name={decodeURIComponent(name)} />;
}

export const Route = createFileRoute("/business-data/shift-definition/$name")({
  component: ShiftDefinitionDetailRoute,
});
