import { createFileRoute } from "@tanstack/react-router";
import { SortRuleSetDetailPage } from "@/features/business-data/entities/sort-rule-set/SortRuleSetDetailPage";

function SortRuleSetDetailRoute() {
  const { name } = Route.useParams();
  return <SortRuleSetDetailPage name={decodeURIComponent(name)} />;
}

export const Route = createFileRoute("/business-data/sort-rule-set/$name")({
  component: SortRuleSetDetailRoute,
});
