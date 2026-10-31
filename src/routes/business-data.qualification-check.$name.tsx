import { createFileRoute } from "@tanstack/react-router";
import { QualificationCheckDetailPage } from "@/features/business-data/qualification-check/QualificationCheckDetailPage";

function QualificationCheckDetailRoute() {
  const { name } = Route.useParams();
  return <QualificationCheckDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/qualification-check/$name")({
  component: QualificationCheckDetailRoute,
});
