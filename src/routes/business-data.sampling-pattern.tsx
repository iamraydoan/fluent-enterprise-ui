import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { SamplingPatternListPage } from "@/features/business-data/sampling-pattern/SamplingPatternListPage";

function SamplingPatternRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/sampling-pattern") return <SamplingPatternListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/sampling-pattern")({
  component: SamplingPatternRoute,
});
