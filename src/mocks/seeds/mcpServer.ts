import type { McpServerDetail, McpServerRecord } from "@/api";
import { RecordState } from "@/api";

export const MCP_SERVER_ROWS: McpServerRecord[] = [
  {
    name: "Cubes",
    description: "Cube.js data cubes",
    url: "http://mcp-cubejs:8080/mcp",
    state: RecordState.Active,
  },
  {
    name: "CM MES",
    description: "MES entities, documents and attachments",
    url: "http://mcp-cm-mes:8080/mcp",
    state: RecordState.Active,
  },
  {
    name: "CM Portal Documentation",
    description: "Product documentation search",
    url: "http://mcp-cm-portal-documentation:8080/mcp",
    state: RecordState.Active,
  },
  {
    name: "CM Data ClickHouse",
    description: "ClickHouse SQL data access",
    url: "http://mcp-cm-data-clickhouse:8080/mcp",
    state: RecordState.Active,
  },
  {
    name: "CM Data Grafana",
    description: "Grafana dashboards and datasources",
    url: "http://mcp-cm-data-grafana:8080/mcp",
    state: RecordState.Draft,
  },
];

const MCP_AUTHENTICATION = {
  mode: "OAuth",
  clientId: "MES",
  authUrl:
    "https://nightly-dev-120-mes.apps.rhos.cm-mes.dev/SecurityPortal/tenant/MesDevelopment/login",
  tokenUrl:
    "https://nightly-dev-120-mes.apps.rhos.cm-mes.dev/SecurityPortal/api/tenant/MesDevelopment/oauth2/token",
  scope: "",
};

const FALLBACK_SERVER_TOOLS: Record<string, string[]> = {
  "CM Data ClickHouse": ["run_select_query", "search_tables", "get_table_schemas"],
  "CM Portal Documentation": ["search_documentation", "get_adjacent_chunks"],
  "CM Data Cube.js": ["get_cube_schemas", "run_cube_query", "list_cubes"],
  "CM Data OData": ["odata_query", "odata_metadata", "odata_count"],
  "CM MES Entity UI Page": [
    "get_ui_page",
    "list_ui_pages",
    "create_ui_page",
    "update_ui_page",
    "delete_ui_page",
  ],
  "CM MES Entity Query": [
    "run_entity_query",
    "list_queries",
    "get_query_definition",
    "get_query_results",
    "save_query",
    "delete_query",
  ],
  "CM Data Grafana": [
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
  "CM MES": [
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
};

const MCP_DETAIL: Record<string, McpServerDetail> = {
  Cubes: {
    description: "",
    url: "http://mcp-cubejs:8080/mcp",
    sync: "Completed",
    protocol: "2024-11-05",
    isSystem: true,
    init: 10,
    req: 10,
    auth: MCP_AUTHENTICATION,
    lastSync: "08/07/2026 08:10 PM",
    tools: [
      [
        "get_cube_schemas",
        "Retrieves the JSON schema (measures, dimensions, etc.) for every Cube.js cube exposed by this server. Read-only.",
      ],
      [
        "run_cube_query",
        "Runs a GraphQL query against the Cube.js cubes and returns result rows as JSON.",
      ],
    ],
  },
};

export function mcpDetail(name: string): McpServerDetail {
  return (
    MCP_DETAIL[name] ?? {
      description: "",
      url: `http://mcp-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}:8080/mcp`,
      sync: "Completed",
      protocol: "2024-11-05",
      isSystem: true,
      init: 10,
      req: 10,
      auth: MCP_AUTHENTICATION,
      lastSync: "08/07/2026 08:10 PM",
      tools: (FALLBACK_SERVER_TOOLS[name] ?? [])
        .slice(0, 5)
        .map((tool) => [tool, `Tool exposed by the ${name} MCP server.`]),
    }
  );
}
