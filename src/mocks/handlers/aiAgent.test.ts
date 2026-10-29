import { describe, expect, test } from "vitest";
import { buildAiAgentDetail } from "../seeds/aiAgent";
import { queryAiAgents } from "./aiAgent";

describe("queryAiAgents", () => {
  test("lists five agents including AnalyticsViewAgent", () => {
    const result = queryAiAgents({ page: 1, limit: 5 });
    expect(result.data).toHaveLength(5);
    expect(result.meta).toEqual({ page: 1, limit: 5, total: 5 });
    expect(result.data.map((row) => row.name)).toContain("AnalyticsViewAgent");
  });

  test("paginates with meta totals", () => {
    const result = queryAiAgents({ page: 1, limit: 2 });
    expect(result.data).toHaveLength(2);
    expect(result.meta).toEqual({ page: 1, limit: 2, total: 5 });
    const second = queryAiAgents({ page: 2, limit: 2 });
    expect(second.data).toHaveLength(2);
    expect(second.data[0].name).not.toBe(result.data[0].name);
    expect(second.meta.page).toBe(2);
    const last = queryAiAgents({ page: 3, limit: 2 });
    expect(last.data).toHaveLength(1);
  });

  test("returns an empty page beyond the last page", () => {
    const result = queryAiAgents({ page: 99, limit: 2 });
    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(5);
  });

  test("sorts by name ascending and descending", () => {
    const asc = queryAiAgents({ page: 1, limit: 5, sort: "name" });
    const names = asc.data.map((row) => row.name);
    const sorted = [...names].sort((first, second) =>
      first.localeCompare(second, "en", { sensitivity: "base" }),
    );
    expect(names).toEqual(sorted);
    const desc = queryAiAgents({ page: 1, limit: 5, sort: "-name" });
    const descNames = desc.data.map((row) => row.name);
    const descSorted = [...descNames].sort((first, second) =>
      second.localeCompare(first, "en", { sensitivity: "base" }),
    );
    expect(descNames).toEqual(descSorted);
  });

  test("sorts by mcpServers numerically", () => {
    const asc = queryAiAgents({ page: 1, limit: 5, sort: "mcpServers" });
    const counts = asc.data.map((row) => row.mcpServers);
    expect(counts).toEqual([0, 1, 1, 1, 2]);
    const desc = queryAiAgents({ page: 1, limit: 5, sort: "-mcpServers" });
    expect(desc.data.map((row) => row.mcpServers)).toEqual([2, 1, 1, 1, 0]);
  });

  test("ignores unknown sort values", () => {
    const result = queryAiAgents({ page: 1, limit: 5, sort: "nope" });
    expect(result.data).toHaveLength(5);
    expect(result.meta.total).toBe(5);
  });

  test("searches names case-insensitively", () => {
    const result = queryAiAgents({ page: 1, limit: 5, q: "QUALITY" });
    expect(result.meta.total).toBe(1);
    expect(result.data[0].name).toBe("Quality Assistant");
  });

  test("searches states", () => {
    const active = queryAiAgents({ page: 1, limit: 5, q: "active" });
    expect(active.meta.total).toBe(4);
    expect(active.data.every((row) => row.state === "Active")).toBe(true);
    const draft = queryAiAgents({ page: 1, limit: 5, q: "draft" });
    expect(draft.meta.total).toBe(1);
    expect(draft.data[0].name).toBe("Maintenance Planner");
  });

  test("filters by state case-insensitively", () => {
    const draft = queryAiAgents({ page: 1, limit: 5, state: "draft" });
    expect(draft.meta.total).toBe(1);
    expect(draft.data[0].name).toBe("Maintenance Planner");
    const active = queryAiAgents({ page: 1, limit: 5, state: "ACTIVE" });
    expect(active.meta.total).toBe(4);
  });

  test("searches English descriptions", () => {
    const result = queryAiAgents({ page: 1, limit: 5, q: "summarizes attachments" });
    expect(result.meta.total).toBe(1);
    expect(result.data[0].name).toBe("Document Summarizer");
  });

  test("returns full data for CM MES Agent and the fallback for other agents", () => {
    const mes = buildAiAgentDetail("CM MES Agent");
    expect(mes.name).toBe("CM MES Agent");
    expect(mes.sync).toBe("Completed");
    expect(mes.description).toContain("general MES assistant");
    expect(mes.history).toHaveLength(3);
    const analytics = buildAiAgentDetail("AnalyticsViewAgent");
    expect(analytics.provider).toBe("bedrock");
    expect(analytics.runtime).toBe("LibreChat");
    expect(analytics.sync).toBe("Pending");
    const fallback = buildAiAgentDetail("Quality Assistant");
    expect(fallback.name).toBe("Quality Assistant");
    expect(fallback.description).toBe("");
    expect(fallback.instructions).toBe("You are Quality Assistant.");
    expect(fallback.provider).toBe("bedrock");
    expect(fallback.history).toHaveLength(3);
  });
});
