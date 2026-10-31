import { createFileRoute } from "@tanstack/react-router";
import { QualificationDetailPage } from "@/features/business-data/qualification/QualificationDetailPage";

function QualificationDetailRoute() {
  const { name } = Route.useParams();
  return <QualificationDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/qualification/$name")({
  component: QualificationDetailRoute,
});
