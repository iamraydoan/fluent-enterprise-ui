import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { BusinessPartnerListPage } from "@/features/business-data/business-partner/BusinessPartnerListPage";

function BusinessPartnerRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/business-partner") return <BusinessPartnerListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/business-partner")({
  component: BusinessPartnerRoute,
});
