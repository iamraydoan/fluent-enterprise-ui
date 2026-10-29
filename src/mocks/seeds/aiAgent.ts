import type { AiAgentDetail, AiAgentRecord } from "@/api";

export function buildAiAgentSeeds(): AiAgentRecord[] {
  return [
    {
      name: "CM MES Agent",
      description: "Answers questions about MES documents and entity revisions",
      mcpServers: 2,
      state: "Active",
    },
    {
      name: "AnalyticsViewAgent",
      description: "Builds and refines analytics dashboards for Analytics Views",
      mcpServers: 1,
      state: "Active",
    },
    {
      name: "Quality Assistant",
      description: "Helps review non-conformance reports",
      mcpServers: 1,
      state: "Active",
    },
    {
      name: "Document Summarizer",
      description: "Summarizes attachments and documents",
      mcpServers: 1,
      state: "Active",
    },
    {
      name: "Maintenance Planner",
      description: "Suggests maintenance schedules",
      mcpServers: 0,
      state: "Draft",
    },
  ];
}

const AGENT_MODEL =
  "arn:aws:bedrock:eu-north-1:211125333158:inference-profile/eu.anthropic.claude-sonnet-4-20250514-v1:0";

const ANALYTICS_INSTRUCTIONS = `You are the CM Analytics View Copilot. You generate or refine Grafana dashboards and associate them with MES Analytics Views. ## CONTEXT - Analytics View Id: {{analyticsViewId}} - Analytics View Name: {{analyticsViewName}} - Analytics View Folder: {{analyticsViewFolder}} - Analytics View Dashboard URL: {{analyticsViewDashboardUrl}} ## WORKFLOW 1. DECIDE: Analytics View id exists → UPDATE. URL exists → REFINE. Else → CREATE. 2. EXPLORE: Search Library Folder for existing dashboards on the same topic (search_dashboards + get_dashboard_by_uid). Use them as authoritative templates. 3. EXPLORE DATA: Run get_cube_schemas, then validate with a plain unfiltered run_cube_query before adding any filters or variables. 4. CREATE: Build dashboard in the AI_Generated folder using validated queries. 5. LINK: Create or update the Analytics View via create_analytics_view / update_analytics_view. ## EXECUTION - SILENT EXECUTION: Never provide explanatory text, progress updates, or intermediate commentary during tool execution. ## DATASOURCE - Name: "DataManager-Cubes" (string, not object) — always include parsingOptions. ## GRAPHQL RULES - Always test bare queries first. Never assume filters work. ## Color Palette for Charts, Dashboards and Reports - Blue (Primary): #0066A1 - Light Blue: #B8D1E0 - Gray: #AAAAAA - Dark Gray: #414141 - Orange (Accent): #E15532 - Cyan: #3CAAF0. Usage Guidelines 1. Use Primary Blue (#0066A1) as the main/hero color 2. For multi-series charts, cycle through: Blue → Orange → Green → Gray → Cyan 3. Always use Green/Yellow/Red consistently for Good/Warning/Bad status 4. Use Light Gray (#D8D8D8) for backgrounds, gridlines, and inactive states.`;

const MES_AGENT_INSTRUCTIONS =
  "You are the CM MES Agent.\nUse the CM MES tools to read documents, attachments and entity revisions.\nAlways cite the entity name and revision you used in your answer.";

const AI_AGENT_HISTORY: string[][] = [
  ["28/10/2026 09:12", "Nguyen Minh Anh", "Updated", "Instructions changed"],
  ["27/10/2026 16:40", "Tran Quoc Bao", "Updated", "Added MCP server CM Data Cube.js"],
  ["12/10/2026 08:05", "Nguyen Minh Anh", "Created", "Agent created"],
];

type AiAgentDetailSeed = Omit<AiAgentDetail, "name" | "history">;

const AGENT_DETAILS: Record<string, AiAgentDetailSeed> = {
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

export function buildAiAgentDetail(name: string): AiAgentDetail {
  const known = AGENT_DETAILS[name];
  if (known !== undefined) {
    return { name, ...known, history: AI_AGENT_HISTORY };
  }
  return {
    name,
    ...AGENT_DETAILS["CM MES Agent"],
    description: "",
    instructions: `You are ${name}.`,
    history: AI_AGENT_HISTORY,
  };
}
