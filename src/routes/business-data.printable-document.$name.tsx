import { createFileRoute } from "@tanstack/react-router";
import { PrintableDocumentDetailPage } from "@/features/business-data/entities/printable-document/PrintableDocumentDetailPage";

function PrintableDocumentDetailRoute() {
  const { name } = Route.useParams();
  return <PrintableDocumentDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/printable-document/$name")({
  component: PrintableDocumentDetailRoute,
});
