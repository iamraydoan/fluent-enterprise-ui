import { createFileRoute } from "@tanstack/react-router";
import { DocumentDetailPage } from "@/features/business-data/document/DocumentDetailPage";

function DocumentDetailRoute() {
  const { name } = Route.useParams();
  return <DocumentDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/document/$name")({
  component: DocumentDetailRoute,
});
