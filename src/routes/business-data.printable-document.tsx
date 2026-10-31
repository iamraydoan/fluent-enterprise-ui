import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { PrintableDocumentListPage } from "@/features/business-data/printable-document/PrintableDocumentListPage";

function PrintableDocumentRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/printable-document")
    return <PrintableDocumentListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/printable-document")({
  component: PrintableDocumentRoute,
});
