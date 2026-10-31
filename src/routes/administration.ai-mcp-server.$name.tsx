import { createFileRoute } from "@tanstack/react-router";
import { McpServerDetailPage } from "@/features/administration/ai-mcp-server/McpServerDetailPage";

function McpServerDetailRoute() {
  const { name } = Route.useParams();
  return <McpServerDetailPage name={name} />;
}

export const Route = createFileRoute("/administration/ai-mcp-server/$name")({
  component: McpServerDetailRoute,
});
