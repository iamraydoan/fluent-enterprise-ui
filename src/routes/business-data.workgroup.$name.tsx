import { createFileRoute } from "@tanstack/react-router";
import { WorkgroupDetailPage } from "@/features/business-data/workgroup/WorkgroupDetailPage";

function WorkgroupDetailRoute() {
  const { name } = Route.useParams();
  return <WorkgroupDetailPage name={decodeURIComponent(name)} />;
}

export const Route = createFileRoute("/business-data/workgroup/$name")({
  component: WorkgroupDetailRoute,
});
