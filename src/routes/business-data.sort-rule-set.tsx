import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { SortRuleSetListPage } from "@/features/business-data/sort-rule-set/SortRuleSetListPage";

function SortRuleSetRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/sort-rule-set") return <SortRuleSetListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/sort-rule-set")({
  component: SortRuleSetRoute,
});
