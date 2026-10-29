import type { TranslationKey } from "@/i18n";

export interface McpServerTools {
  name: string;
  tools: string[];
}

export const MCP_SERVERS: McpServerTools[] = [
  {
    name: "CM Data ClickHouse",
    tools: ["run_select_query", "search_tables", "get_table_schemas"],
  },
  {
    name: "CM Portal Documentation",
    tools: ["search_documentation", "get_adjacent_chunks"],
  },
  {
    name: "CM Data Cube.js",
    tools: ["get_cube_schemas", "run_cube_query", "list_cubes"],
  },
  {
    name: "CM Data Grafana",
    tools: [
      "search_dashboards",
      "get_dashboard_by_uid",
      "create_dashboard",
      "update_dashboard",
      "list_datasources",
      "get_datasource",
      "query_datasource",
      "list_folders",
      "create_folder",
      "get_panel_image",
      ...Array.from({ length: 71 }, (_, index) => `grafana_tool_${index + 1}`),
    ],
  },
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
      "get_entity_object",
      "get_entity_documents_and_attachments",
      "get_id_from_entity_previous_version",
      "search_entities",
      "list_entity_types",
      "get_entity_history",
      "get_entity_relations",
      "get_resource_by_name",
      "get_product_by_name",
      "get_material_by_name",
      "get_work_order_status",
      "get_document_by_name",
    ],
  },
  {
    name: "CM MES Entity UI Page",
    tools: ["get_ui_page", "list_ui_pages", "create_ui_page", "update_ui_page", "delete_ui_page"],
  },
  {
    name: "CM Data OData",
    tools: ["odata_query", "odata_metadata", "odata_count"],
  },
  {
    name: "CM MES Entity Query",
    tools: [
      "run_entity_query",
      "list_queries",
      "get_query_definition",
      "get_query_results",
      "save_query",
      "delete_query",
    ],
  },
];

export function serverTools(name: string): string[] {
  return MCP_SERVERS.find((server) => server.name === name)?.tools ?? [];
}

export type ToolSelection = Record<string, Record<string, boolean>>;

export const INITIAL_SELECTION: ToolSelection = {
  "CM MES": Object.fromEntries(
    serverTools("CM MES")
      .slice(0, 13)
      .map((tool) => [tool, false]),
  ),
  "CM Data Cube.js": { get_cube_schemas: false, run_cube_query: false },
};

export function countSelected(selection: ToolSelection): number {
  return Object.values(selection).reduce((total, tools) => total + Object.keys(tools).length, 0);
}

export function toolText(server: string, tool: string): string {
  if (tool === "run_select_query") {
    return `Runs a ClickHouse SQL select query against one data source and returns the result rows as JSON.

INPUT:
- query: A ClickHouse SQL select query. Use only the table and column names returned by get_table_schemas.
- dataSource: The data source holding the tables the query reads (MES, CDM, ODS or DWH), exactly as returned by
        search_tables or get_table_schemas. It selects the database the query runs against, so a query
        sent with the wrong data source fails or reads the wrong tables. A single query cannot span two
        data sources.

OUTPUT:
- The result rows as JSON.

WHEN TO USE THIS TOOL:
- After get_table_schemas has returned a table containing every column needed.`;
  }
  return `${tool} is exposed by the ${server} MCP server.

OUTPUT:
- The result as JSON.

WHEN TO USE THIS TOOL:
- When the agent needs the data this tool returns. (Sample description for the demo.)`;
}

export const MCP_SERVER_SECTIONS: TranslationKey[] = [
  "mcpServer.sections.details",
  "mcpServer.sections.tools",
  "mcpServer.sections.attachments",
];
