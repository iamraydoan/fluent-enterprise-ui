import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { ChecklistListPage } from "@/features/business-data/checklist/ChecklistListPage";

function ChecklistRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/checklist") return <ChecklistListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/checklist")({
  component: ChecklistRoute,
});
