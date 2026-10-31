import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { CertificationListPage } from "@/features/business-data/certification/CertificationListPage";

function CertificationRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/certification") return <CertificationListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/certification")({
  component: CertificationRoute,
});
