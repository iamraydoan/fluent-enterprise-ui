import { describe, expect, test } from "vitest";
import { MCP_SERVER_ROWS, mcpDetail } from "../seeds/mcpServer";
import { queryMcpServers } from "./mcpServer";

describe("mcp server seeds", () => {
  test("lists five servers with mcp host urls", () => {
    expect(MCP_SERVER_ROWS).toHaveLength(5);
    expect(MCP_SERVER_ROWS.map((row) => row.url)).toContain("http://mcp-cubejs:8080/mcp");
    expect(MCP_SERVER_ROWS.map((row) => row.name)).not.toContain("Document Server");
    expect(MCP_SERVER_ROWS.map((row) => row.name)).not.toContain("Search Server");
  });

  test("keeps the Cubes detail with two tools and OAuth auth", () => {
    const detail = mcpDetail("Cubes");
    expect(detail.url).toBe("http://mcp-cubejs:8080/mcp");
    expect(detail.tools).toHaveLength(2);
    expect(detail.auth.mode).toBe("OAuth");
  });

  test("derives fallback detail urls from the server name", () => {
    const cmMes = mcpDetail("CM MES");
    expect(cmMes.url).toBe("http://mcp-cm-mes:8080/mcp");
    expect(cmMes.tools).toHaveLength(5);
    expect(cmMes.tools[0][0]).toBe("get_attachment_to_summarize");
    expect(cmMes.auth.mode).toBe("OAuth");
    expect(mcpDetail("CM Data Cube.js").tools).toHaveLength(3);
  });

  test("falls back to a derived url with no tools for unknown names", () => {
    const detail = mcpDetail("Nope");
    expect(detail.url).toBe("http://mcp-nope:8080/mcp");
    expect(detail.tools).toHaveLength(0);
    expect(detail.auth.mode).toBe("OAuth");
    expect(detail.sync).toBe("Completed");
  });
});

describe("queryMcpServers", () => {
  test("paginates with meta totals", () => {
    const result = queryMcpServers({ page: 1, limit: 2 });
    expect(result.data).toHaveLength(2);
    expect(result.meta).toEqual({ page: 1, limit: 2, total: 5 });
    const third = queryMcpServers({ page: 3, limit: 2 });
    expect(third.data).toHaveLength(1);
    expect(third.meta.page).toBe(3);
    expect(third.data[0].name).not.toBe(result.data[0].name);
  });

  test("clamps limit to the spec maximum", () => {
    const result = queryMcpServers({ page: 1, limit: 500 });
    expect(result.meta.limit).toBe(200);
    expect(result.data).toHaveLength(5);
  });

  test("returns an empty page beyond the last page", () => {
    const result = queryMcpServers({ page: 99, limit: 2 });
    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(5);
  });

  test("sorts by name ascending and descending", () => {
    const asc = queryMcpServers({ page: 1, limit: 5, sort: "name" });
    const names = asc.data.map((row) => row.name);
    const sorted = [...names].sort((first, second) =>
      first.localeCompare(second, "en", { sensitivity: "base" }),
    );
    expect(names).toEqual(sorted);
    expect(names[0]).toBe("CM Data ClickHouse");
    const desc = queryMcpServers({ page: 1, limit: 5, sort: "-name" });
    const descNames = desc.data.map((row) => row.name);
    expect(descNames).toEqual([...names].reverse());
    expect(descNames[0]).toBe("Cubes");
  });

  test("sorts by state", () => {
    const asc = queryMcpServers({ page: 1, limit: 5, sort: "state" });
    expect(asc.data[0].state).toBe("Active");
    expect(asc.data[4].state).toBe("Draft");
    const desc = queryMcpServers({ page: 1, limit: 5, sort: "-state" });
    expect(desc.data[0].state).toBe("Draft");
  });

  test("ignores unknown sort values", () => {
    const result = queryMcpServers({ page: 1, limit: 5, sort: "nope" });
    expect(result.data).toHaveLength(5);
    expect(result.meta.total).toBe(5);
    expect(result.data[0].name).toBe("Cubes");
  });

  test("searches name, description key, url and state case-insensitively", () => {
    const byName = queryMcpServers({ page: 1, limit: 5, q: "CUBES" });
    expect(byName.meta.total).toBe(1);
    expect(byName.data[0].name).toBe("Cubes");
    const byUrl = queryMcpServers({ page: 1, limit: 5, q: "clickhouse" });
    expect(byUrl.meta.total).toBe(1);
    expect(byUrl.data[0].name).toBe("CM Data ClickHouse");
    const byDescription = queryMcpServers({
      page: 1,
      limit: 5,
      q: "grafana dashboards",
    });
    expect(byDescription.meta.total).toBe(1);
    expect(byDescription.data[0].name).toBe("CM Data Grafana");
    const byState = queryMcpServers({ page: 1, limit: 5, q: "draft" });
    expect(byState.meta.total).toBe(1);
    expect(byState.data[0].name).toBe("CM Data Grafana");
    const allData = queryMcpServers({ page: 1, limit: 5, q: "mcp" });
    expect(allData.meta.total).toBe(5);
  });

  test("treats an empty query as no filter", () => {
    const result = queryMcpServers({ page: 1, limit: 5, q: "" });
    expect(result.meta.total).toBe(5);
  });

  test("returns no rows for an unmatched query", () => {
    const result = queryMcpServers({ page: 1, limit: 5, q: "no-such-server" });
    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(0);
  });
});
