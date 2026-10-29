export interface AiAgentRow {
  name: string;
  description: string;
  mcpServers: string;
  state: string;
}

export const AI_AGENT_ROWS: AiAgentRow[] = [
  {
    name: "CM MES Agent",
    description: "Answers questions about MES documents and entity revisions",
    mcpServers: "2",
    state: "Active",
  },
  {
    name: "AnalyticsViewAgent",
    description: "Builds and refines analytics dashboards for Analytics Views",
    mcpServers: "1",
    state: "Active",
  },
  {
    name: "Quality Assistant",
    description: "Helps review non-conformance reports",
    mcpServers: "1",
    state: "Active",
  },
  {
    name: "Document Summarizer",
    description: "Summarizes attachments and documents",
    mcpServers: "1",
    state: "Active",
  },
  {
    name: "Maintenance Planner",
    description: "Suggests maintenance schedules",
    mcpServers: "0",
    state: "Draft",
  },
];

export interface AiAgentDetail {
  description: string;
  provider: string;
  model: string;
  runtime: string;
  publish: boolean;
  sync: string;
  instructions: string;
}

const AGENT_MODEL =
  "arn:aws:bedrock:eu-north-1:211125333158:inference-profile/eu.anthropic.claude-sonnet-4-20250514-v1:0";

const ANALYTICS_INSTRUCTIONS = `You are the CM Analytics View Copilot. You generate or refine Grafana dashboards and associate them with MES Analytics Views. ## CONTEXT - Analytics View Id: {{analyticsViewId}} - Analytics View Name: {{analyticsViewName}} - Analytics View Folder: {{analyticsViewFolder}} - Analytics View Dashboard URL: {{analyticsViewDashboardUrl}} ## WORKFLOW 1. DECIDE: Analytics View id exists → UPDATE. URL exists → REFINE. Else → CREATE. 2. EXPLORE: Search Library Folder for existing dashboards on the same topic (search_dashboards + get_dashboard_by_uid). Use them as authoritative templates. 3. EXPLORE DATA: Run get_cube_schemas, then validate with a plain unfiltered run_cube_query before adding any filters or variables. 4. CREATE: Build dashboard in the AI_Generated folder using validated queries. 5. LINK: Create or update the Analytics View via create_analytics_view / update_analytics_view. ## EXECUTION - SILENT EXECUTION: Never provide explanatory text, progress updates, or intermediate commentary during tool execution. ## DATASOURCE - Name: "DataManager-Cubes" (string, not object) — always include parsingOptions. ## GRAPHQL RULES - Always test bare queries first. Never assume filters work. ## Color Palette for Charts, Dashboards and Reports - Blue (Primary): #0066A1 - Light Blue: #B8D1E0 - Gray: #AAAAAA - Dark Gray: #414141 - Orange (Accent): #E15532 - Cyan: #3CAAF0. Usage Guidelines 1. Use Primary Blue (#0066A1) as the main/hero color 2. For multi-series charts, cycle through: Blue → Orange → Green → Gray → Cyan 3. Always use Green/Yellow/Red consistently for Good/Warning/Bad status 4. Use Light Gray (#D8D8D8) for backgrounds, gridlines, and inactive states.`;

const MES_AGENT_INSTRUCTIONS =
  "You are the CM MES Agent.\nUse the CM MES tools to read documents, attachments and entity revisions.\nAlways cite the entity name and revision you used in your answer.";

export const AGENT_DETAILS: Record<string, AiAgentDetail> = {
  AnalyticsViewAgent: {
    description: "",
    provider: "bedrock",
    model: AGENT_MODEL,
    runtime: "LibreChat",
    publish: true,
    sync: "Pending",
    instructions: ANALYTICS_INSTRUCTIONS,
  },
  "CM MES Agent": {
    description:
      "Acts as a general MES assistant, a starting point for questions about products, resources or documents.",
    provider: "bedrock",
    model: AGENT_MODEL,
    runtime: "LibreChat",
    publish: true,
    sync: "Completed",
    instructions: MES_AGENT_INSTRUCTIONS,
  },
};

export function agentData(name: string): AiAgentDetail {
  return (
    AGENT_DETAILS[name] ?? {
      ...AGENT_DETAILS["CM MES Agent"],
      description: "",
      instructions: `You are ${name}.`,
    }
  );
}

export const AI_AGENT_SECTIONS = ["Details", "Instructions", "MCP Servers", "Attachments"];

export const AI_AGENT_HISTORY: string[][] = [
  ["28/10/2026 09:12", "Nguyen Minh Anh", "Updated", "Instructions changed"],
  ["27/10/2026 16:40", "Tran Quoc Bao", "Updated", "Added MCP server CM Data Cube.js"],
  ["12/10/2026 08:05", "Nguyen Minh Anh", "Created", "Agent created"],
];

export interface McpServerTools {
  name: string;
  tools: string[];
}

export const AGENT_MCP_SERVERS: McpServerTools[] = [
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

export function agentServerTools(name: string): string[] {
  return AGENT_MCP_SERVERS.find((server) => server.name === name)?.tools ?? [];
}

export type ToolSelection = Record<string, Record<string, boolean>>;

export const INITIAL_TOOL_SELECTION: ToolSelection = {
  "CM MES": Object.fromEntries(
    agentServerTools("CM MES")
      .slice(0, 13)
      .map((tool) => [tool, false]),
  ),
  "CM Data Cube.js": { get_cube_schemas: false, run_cube_query: false },
};

export function countSelectedTools(selection: ToolSelection): number {
  return Object.values(selection).reduce((total, tools) => total + Object.keys(tools).length, 0);
}

export function toolDescription(server: string, tool: string): string {
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
