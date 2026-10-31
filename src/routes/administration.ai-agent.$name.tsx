import { createFileRoute } from "@tanstack/react-router";
import { AiAgentDetailPage } from "@/features/administration/ai-agent/AiAgentDetailPage";

function AiAgentDetailRoute() {
  const { name } = Route.useParams();
  return <AiAgentDetailPage name={name} />;
}

export const Route = createFileRoute("/administration/ai-agent/$name")({
  component: AiAgentDetailRoute,
});
