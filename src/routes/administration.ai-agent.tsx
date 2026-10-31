import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { AiAgentListPage } from "@/features/administration/ai-agent/AiAgentListPage";

function AiAgentRoute() {
  const location = useLocation();
  if (location.pathname === "/administration/ai-agent") return <AiAgentListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/administration/ai-agent")({
  component: AiAgentRoute,
});
