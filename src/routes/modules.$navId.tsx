import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/features/modules/ModulePage";

function ModuleRoute() {
  const { navId } = Route.useParams();
  return <ModulePage id={navId} />;
}

export const Route = createFileRoute("/modules/$navId")({
  component: ModuleRoute,
});
