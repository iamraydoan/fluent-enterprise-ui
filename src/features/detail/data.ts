import type { HistoryRow, ToolGroup } from "./types";

export const TOOL_GROUPS: ToolGroup[] = [
  {
    name: "CM MES",
    tools: [
      "get_attachment_to_summarize",
      "get_document_content",
      "get_document_as_chunks",
      "get_id_from_entity_effective_previous_version",
      "get_id_from_previous_sign_document_revision",
      "get_attachment_as_chunks",
      "get_entity_id_by_name_revision_version",
      "get_object_by_name",
      "compare_entities",
      "compare_document_entity",
      "compare_attachments",
      "list_entity_revisions",
      "get_entity_by_id",
    ],
  },
  { name: "Analytics MCP", tools: ["run_analytics_view", "get_view_schema"] },
];
export const TOTAL_TOOL_COUNT = TOOL_GROUPS.reduce((n, g) => n + g.tools.length, 0);
export const DETAILS_PANEL_ITEMS = ["Details", "Instructions", "MCP Servers", "Attachments"];
export const HISTORY_ENTRIES: HistoryRow[] = [
  ["28/10/2026 09:12", "Nguyen Minh Anh", "Updated", "Instructions changed"],
  ["27/10/2026 16:40", "Tran Quoc Bao", "Updated", "Added MCP server Analytics MCP"],
  ["12/10/2026 08:05", "Nguyen Minh Anh", "Created", "Agent created"],
];
