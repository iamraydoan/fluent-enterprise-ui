export interface McpServerRow {
  name: string;
  description: string;
  state: string;
}

export const MCP_SERVER_ROWS: McpServerRow[] = [
  { name: "Cubes", description: "", state: "Active" },
  {
    name: "Document Server",
    description: "Provides document retrieval tools",
    state: "Active",
  },
  { name: "Search Server", description: "Provides search tools", state: "Draft" },
];

export interface McpServerDetail {
  name: string;
  description: string;
  state: string;
  dataGroup: string;
  initializationTimeout: string;
  instructions: string;
  requestTimeout: string;
  url: string;
  synchronizationStatus: string;
  protocolVersion: string;
  isSystem: string;
  authenticationMode: string;
  clientId: string;
  authorizationUrl: string;
  tokenUrl: string;
  scope: string;
}

const CUBES_AUTHORIZATION_URL =
  "https://nightly-dev-120-mes.apps.rhos.cm-mes.dev/SecurityPortal/tenant/MesDevelopment/login";
const CUBES_TOKEN_URL =
  "https://nightly-dev-120-mes.apps.rhos.cm-mes.dev/SecurityPortal/api/tenant/MesDevelopment/oauth2/token";

const MCP_SERVER_DETAILS: Record<string, McpServerDetail> = {
  Cubes: {
    name: "Cubes",
    description: "",
    state: "Active",
    dataGroup: "",
    initializationTimeout: "10",
    instructions: "",
    requestTimeout: "10",
    url: "http://mcp-cube:8080/mcp",
    synchronizationStatus: "Completed",
    protocolVersion: "2024-11-05",
    isSystem: "Yes",
    authenticationMode: "OAuth",
    clientId: "MES",
    authorizationUrl: CUBES_AUTHORIZATION_URL,
    tokenUrl: CUBES_TOKEN_URL,
    scope: "",
  },
  "Document Server": {
    name: "Document Server",
    description: "Provides document retrieval tools",
    state: "Active",
    dataGroup: "",
    initializationTimeout: "10",
    instructions: "",
    requestTimeout: "10",
    url: "http://mcp-document-server:8080/mcp",
    synchronizationStatus: "Completed",
    protocolVersion: "2024-11-05",
    isSystem: "No",
    authenticationMode: "OAuth",
    clientId: "MES",
    authorizationUrl: CUBES_AUTHORIZATION_URL,
    tokenUrl: CUBES_TOKEN_URL,
    scope: "",
  },
  "Search Server": {
    name: "Search Server",
    description: "Provides search tools",
    state: "Draft",
    dataGroup: "",
    initializationTimeout: "10",
    instructions: "",
    requestTimeout: "10",
    url: "http://mcp-search-server:8080/mcp",
    synchronizationStatus: "Pending",
    protocolVersion: "2024-11-05",
    isSystem: "No",
    authenticationMode: "OAuth",
    clientId: "MES",
    authorizationUrl: CUBES_AUTHORIZATION_URL,
    tokenUrl: CUBES_TOKEN_URL,
    scope: "",
  },
};

export function mcpServerDetailFor(name: string): McpServerDetail {
  return (
    MCP_SERVER_DETAILS[name] ?? {
      name,
      description: "",
      state: "Active",
      dataGroup: "",
      initializationTimeout: "10",
      instructions: "",
      requestTimeout: "10",
      url: "http://mcp-cube:8080/mcp",
      synchronizationStatus: "Completed",
      protocolVersion: "2024-11-05",
      isSystem: "Yes",
      authenticationMode: "OAuth",
      clientId: "MES",
      authorizationUrl: CUBES_AUTHORIZATION_URL,
      tokenUrl: CUBES_TOKEN_URL,
      scope: "",
    }
  );
}

export const MCP_SERVER_SECTIONS = ["Details", "Tools", "Attachments"];
