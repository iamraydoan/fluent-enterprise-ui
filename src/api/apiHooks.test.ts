import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { listApps, useApps } from "@/api/apps";
import { listReasons, useReasons } from "@/api/businessData/reason";
import { apiFetch } from "@/api/client";

vi.mock("@/api/client", () => ({
  apiFetch: vi.fn(),
}));

const mockApiFetch = vi.mocked(apiFetch);

function createTestClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

beforeEach(() => {
  mockApiFetch.mockReset();
});

describe("useApps query integration", () => {
  it("fetches through the hook queryFn with the given params", async () => {
    const page = { data: [], meta: { page: 1, limit: 10, total: 0 } };
    mockApiFetch.mockResolvedValue(page);
    const client = createTestClient();
    const params = { page: 1, limit: 10 };
    const result = await client.fetchQuery({
      queryKey: ["apps", params],
      queryFn: () => listApps(params),
    });
    expect(result).toBe(page);
    expect(mockApiFetch).toHaveBeenCalledTimes(1);
  });

  it("exposes a useQuery hook function", () => {
    expect(typeof useApps).toBe("function");
  });
});

describe("useReasons query integration", () => {
  it("fetches through the hook queryFn with the given params", async () => {
    const rows = [{ name: "r1" }];
    mockApiFetch.mockResolvedValue(rows);
    const client = createTestClient();
    const params = { q: "r", state: "active" };
    const result = await client.fetchQuery({
      queryKey: ["business-data", "reasons", params],
      queryFn: () => listReasons(params),
    });
    expect(result).toBe(rows);
    const url = mockApiFetch.mock.calls[0][0] as string;
    expect(url).toBe("/business-data/reasons?q=r&state=active");
  });

  it("exposes a useQuery hook function", () => {
    expect(typeof useReasons).toBe("function");
  });
});

describe("query caching", () => {
  it("caches by queryKey and does not refetch", async () => {
    mockApiFetch.mockResolvedValue([]);
    const client = createTestClient();
    const params = { page: 1, limit: 10 };
    await client.fetchQuery({
      queryKey: ["apps", params],
      queryFn: () => listApps(params),
      staleTime: Infinity,
    });
    await client.fetchQuery({
      queryKey: ["apps", params],
      queryFn: () => listApps(params),
      staleTime: Infinity,
    });
    expect(mockApiFetch).toHaveBeenCalledTimes(1);
  });

  it("treats different params as different cache entries", async () => {
    mockApiFetch.mockResolvedValue([]);
    const client = createTestClient();
    await client.fetchQuery({
      queryKey: ["apps", { page: 1, limit: 10 }],
      queryFn: () => listApps({ page: 1, limit: 10 }),
      staleTime: Infinity,
    });
    await client.fetchQuery({
      queryKey: ["apps", { page: 2, limit: 10 }],
      queryFn: () => listApps({ page: 2, limit: 10 }),
      staleTime: Infinity,
    });
    expect(mockApiFetch).toHaveBeenCalledTimes(2);
  });
});
