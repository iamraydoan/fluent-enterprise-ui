import { describe, expect, it } from "vitest";
import {
  countSelected,
  INITIAL_SELECTION,
  MCP_DETAIL,
  mcpDetail,
  MCP_SERVER_ROWS,
  MCP_SERVERS,
  serverTools,
  toolText,
} from "./data";
import type { McpServerAuthentication, McpServerTools, ToolSelection } from "./data";

describe("mcp server data", () => {
  it("lists five real servers with mcp host urls", () => {
    expect(MCP_SERVER_ROWS).toHaveLength(5);
    expect(MCP_SERVER_ROWS.map((row) => row.url)).toContain("http://mcp-cubejs:8080/mcp");
    expect(MCP_SERVER_ROWS.map((row) => row.name)).not.toContain("Document Server");
    expect(MCP_SERVER_ROWS.map((row) => row.name)).not.toContain("Search Server");
  });

  it("derives detail urls from the server name and keeps the Cubes detail", () => {
    expect(mcpDetail("Cubes").url).toBe("http://mcp-cubejs:8080/mcp");
    expect(MCP_DETAIL["Cubes"].tools).toHaveLength(2);
    expect(mcpDetail("CM MES").url).toBe("http://mcp-cm-mes:8080/mcp");
    expect(mcpDetail("CM MES").tools).toHaveLength(5);
  });

  it("selects fifteen tools by default and describes tools", () => {
    const selection: ToolSelection = INITIAL_SELECTION;
    expect(countSelected(selection)).toBe(15);
    expect(serverTools("CM MES")).toContain("compare_entities");
    expect(MCP_SERVERS.map((server: McpServerTools) => server.name)).toContain("CM Data Grafana");
    const authentication: McpServerAuthentication = mcpDetail("Cubes").auth;
    expect(authentication.mode).toBe("OAuth");
    expect(toolText("CM MES", "get_object_by_name")).toContain("CM MES MCP server");
  });
});
