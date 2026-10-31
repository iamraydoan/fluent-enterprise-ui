import { createFileRoute } from "@tanstack/react-router";
import { SetupMatrixDetailPage } from "@/features/business-data/setup-matrix/SetupMatrixDetailPage";

function SetupMatrixDetailRoute() {
  const { name } = Route.useParams();
  return <SetupMatrixDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/setup-matrix/$name")({
  component: SetupMatrixDetailRoute,
});
