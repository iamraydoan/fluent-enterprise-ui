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
  name: string;
  description: string;
  state: string;
  dataGroup: string;
  provider: string;
  model: string;
  runtime: string;
  publishToRuntime: string;
  synchronizationStatus: string;
}

const ANALYTICS_MODEL =
  "arn:aws:bedrock-eu-north-1:211125333158:inference-profile/eu.anthropic.claude-sonnet-4-20250514-v1:0";

const AI_AGENT_DETAILS: Record<string, AiAgentDetail> = {
  AnalyticsViewAgent: {
    name: "AnalyticsViewAgent",
    description: "",
    state: "Active",
    dataGroup: "",
    provider: "bedrock",
    model: ANALYTICS_MODEL,
    runtime: "LibreChat",
    publishToRuntime: "Yes",
    synchronizationStatus: "Pending",
  },
  "CM MES Agent": {
    name: "CM MES Agent",
    description: "Answers questions about MES documents and entity revisions",
    state: "Active",
    dataGroup: "",
    provider: "bedrock",
    model: ANALYTICS_MODEL,
    runtime: "LibreChat",
    publishToRuntime: "Yes",
    synchronizationStatus: "Pending",
  },
  "Quality Assistant": {
    name: "Quality Assistant",
    description: "Helps review non-conformance reports",
    state: "Active",
    dataGroup: "",
    provider: "bedrock",
    model: ANALYTICS_MODEL,
    runtime: "LibreChat",
    publishToRuntime: "Yes",
    synchronizationStatus: "Pending",
  },
  "Document Summarizer": {
    name: "Document Summarizer",
    description: "Summarizes attachments and documents",
    state: "Active",
    dataGroup: "",
    provider: "bedrock",
    model: ANALYTICS_MODEL,
    runtime: "LibreChat",
    publishToRuntime: "Yes",
    synchronizationStatus: "Pending",
  },
  "Maintenance Planner": {
    name: "Maintenance Planner",
    description: "Suggests maintenance schedules",
    state: "Draft",
    dataGroup: "",
    provider: "bedrock",
    model: ANALYTICS_MODEL,
    runtime: "LibreChat",
    publishToRuntime: "Yes",
    synchronizationStatus: "Pending",
  },
};

export function aiAgentDetailFor(name: string): AiAgentDetail {
  return (
    AI_AGENT_DETAILS[name] ?? {
      name,
      description: "",
      state: "Active",
      dataGroup: "",
      provider: "bedrock",
      model: ANALYTICS_MODEL,
      runtime: "LibreChat",
      publishToRuntime: "Yes",
      synchronizationStatus: "Pending",
    }
  );
}

export const AI_AGENT_SECTIONS = ["Details", "Instructions", "MCP Servers", "Attachments"];
