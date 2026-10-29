import { describe, expect, it } from "vitest";
import {
  AGENT_MCP_SERVERS,
  agentServerTools,
  countSelectedTools,
  INITIAL_TOOL_SELECTION,
  toolDescription,
} from "./data";

describe("ai agent data", () => {
  it("selects fifteen tools by default and describes tools", () => {
    expect(countSelectedTools(INITIAL_TOOL_SELECTION)).toBe(15);
    expect(agentServerTools("CM MES")).toContain("get_object_by_name");
    expect(AGENT_MCP_SERVERS).toHaveLength(8);
    expect(toolDescription("CM MES", "get_object_by_name")).toContain("CM MES MCP server");
  });
});
