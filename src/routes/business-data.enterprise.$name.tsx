import { createFileRoute } from "@tanstack/react-router";
import { EnterpriseDetailPage } from "@/features/business-data/enterprise/EnterpriseDetailPage";

function EnterpriseDetailRoute() {
  const { name } = Route.useParams();
  return <EnterpriseDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/enterprise/$name")({
  component: EnterpriseDetailRoute,
});
