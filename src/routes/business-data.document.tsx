import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { DocumentListPage } from "@/features/business-data/document/DocumentListPage";

function DocumentRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/document") return <DocumentListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/document")({
  component: DocumentRoute,
});
