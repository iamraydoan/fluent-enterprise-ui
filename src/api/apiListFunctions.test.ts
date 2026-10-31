import { beforeEach, describe, expect, it, vi } from "vitest";
import { listApps } from "@/api/apps";
import { getReason, listReasons } from "@/api/businessData/reason";
import { apiFetch } from "@/api/client";

vi.mock("@/api/client", () => ({
  apiFetch: vi.fn(),
}));

const mockApiFetch = vi.mocked(apiFetch);

beforeEach(() => {
  mockApiFetch.mockReset();
  mockApiFetch.mockResolvedValue([]);
});

describe("listApps", () => {
  it("builds the list URL with page, limit, and filters", async () => {
    await listApps({ page: 2, limit: 25, filters: { state: "active" } });
    expect(mockApiFetch).toHaveBeenCalledTimes(1);
    const url = mockApiFetch.mock.calls[0][0] as string;
    expect(url).toContain("/apps?");
    expect(url).toContain("page=2");
    expect(url).toContain("limit=25");
    expect(url).toContain("state=active");
  });

  it("omits empty filter values from the URL", async () => {
    await listApps({ page: 1, limit: 10, filters: { q: "", state: "all" } });
    const url = mockApiFetch.mock.calls[0][0] as string;
    expect(url).not.toContain("q=");
    expect(url).not.toContain("state=");
  });

  it("returns the fetched page unchanged", async () => {
    const page = { data: [{ name: "a" }], meta: { page: 1, limit: 10, total: 1 } };
    mockApiFetch.mockResolvedValue(page);
    await expect(listApps({ page: 1, limit: 10 })).resolves.toBe(page);
  });
});

describe("listReasons", () => {
  it("builds the URL from flat q/state params without page and limit", async () => {
    await listReasons({ q: "defect", state: "active" });
    expect(mockApiFetch).toHaveBeenCalledTimes(1);
    const url = mockApiFetch.mock.calls[0][0] as string;
    expect(url).toBe("/business-data/reasons?q=defect&state=active");
  });

  it("omits undefined params", async () => {
    await listReasons({});
    expect(mockApiFetch.mock.calls[0][0]).toBe("/business-data/reasons?");
  });

  it("skips state=all", async () => {
    await listReasons({ state: "all" });
    expect(mockApiFetch.mock.calls[0][0]).toBe("/business-data/reasons?");
  });
});

describe("getReason", () => {
  it("URL-encodes the record name", async () => {
    await getReason("Reason 1/2");
    expect(mockApiFetch).toHaveBeenCalledWith("/business-data/reasons/Reason%201%2F2");
  });
});
