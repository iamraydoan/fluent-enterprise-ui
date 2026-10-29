import { describe, expect, it } from "vitest";
import {
  AGENT_DETAILS,
  agentData,
  AGENT_MCP_SERVERS,
  agentServerTools,
  AI_AGENT_ROWS,
  countSelectedTools,
  INITIAL_TOOL_SELECTION,
  toolDescription,
} from "./data";

describe("ai agent data", () => {
  it("lists five agents including AnalyticsViewAgent", () => {
    expect(AI_AGENT_ROWS).toHaveLength(5);
    expect(AI_AGENT_ROWS.map((row) => row.name)).toContain("AnalyticsViewAgent");
  });

  it("returns full data for CM MES Agent and the fallback pattern for other agents", () => {
    expect(agentData("CM MES Agent").sync).toBe("Completed");
    expect(AGENT_DETAILS["CM MES Agent"].description).toContain("general MES assistant");
    const fallback = agentData("Quality Assistant");
    expect(fallback.description).toBe("");
    expect(fallback.instructions).toBe("You are Quality Assistant.");
    expect(fallback.provider).toBe("bedrock");
  });

  it("selects fifteen tools by default and describes tools", () => {
    expect(countSelectedTools(INITIAL_TOOL_SELECTION)).toBe(15);
    expect(agentServerTools("CM MES")).toContain("get_object_by_name");
    expect(AGENT_MCP_SERVERS).toHaveLength(8);
    expect(toolDescription("CM MES", "get_object_by_name")).toContain("CM MES MCP server");
  });
});
