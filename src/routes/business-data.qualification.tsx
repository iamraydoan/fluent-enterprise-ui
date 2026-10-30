import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { QualificationListPage } from "@/features/business-data/entities/qualification/QualificationListPage";

function QualificationRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/qualification") return <QualificationListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/qualification")({
  component: QualificationRoute,
});
