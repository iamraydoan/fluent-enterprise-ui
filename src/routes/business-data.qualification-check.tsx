import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { QualificationCheckListPage } from "@/features/business-data/entities/qualification-check/QualificationCheckListPage";

function QualificationCheckRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/qualification-check")
    return <QualificationCheckListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/qualification-check")({
  component: QualificationCheckRoute,
});
