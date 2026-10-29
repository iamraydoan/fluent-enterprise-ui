import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { McpServerListPage } from "@/features/ai-mcp-server/McpServerListPage";

function McpServerRoute() {
  const location = useLocation();
  if (location.pathname === "/administration/ai-mcp-server") return <McpServerListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/administration/ai-mcp-server")({
  component: McpServerRoute,
});
