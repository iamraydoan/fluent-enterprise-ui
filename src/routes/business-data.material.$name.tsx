import { createFileRoute } from "@tanstack/react-router";
import { MaterialDetailPage } from "@/features/business-data/material/MaterialDetailPage";

function MaterialDetailRoute() {
  const { name } = Route.useParams();
  return <MaterialDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/material/$name")({
  component: MaterialDetailRoute,
});
