import { describe, expect, it } from "vitest";
import { countSelected, INITIAL_SELECTION, MCP_SERVERS, serverTools, toolText } from "./data";
import type { McpServerTools, ToolSelection } from "./data";

describe("mcp server dialog fixtures", () => {
  it("selects fifteen tools by default and describes tools", () => {
    const selection: ToolSelection = INITIAL_SELECTION;
    expect(countSelected(selection)).toBe(15);
    expect(serverTools("CM MES")).toContain("compare_entities");
    expect(MCP_SERVERS.map((server: McpServerTools) => server.name)).toContain("CM Data Grafana");
    expect(toolText("CM MES", "get_object_by_name")).toContain("CM MES MCP server");
  });
});
