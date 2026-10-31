import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ApiError,
  DEFAULT_REQUEST_TIMEOUT_MS,
  apiFetch,
  apiPatch,
  apiPost,
  apiPut,
  postJson,
} from "@/api/client";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function textResponse(text: string, status: number): Response {
  return new Response(text, { status });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("ApiError", () => {
  it("carries status, message, and path", () => {
    const error = new ApiError(404, "Not found", "/items");
    expect(error.status).toBe(404);
    expect(error.message).toBe("Not found");
    expect(error.path).toBe("/items");
    expect(error.name).toBe("ApiError");
    expect(error).toBeInstanceOf(Error);
  });

  it("defaults path to empty string", () => {
    expect(new ApiError(500, "boom").path).toBe("");
  });
});

describe("apiFetch", () => {
  it("returns parsed JSON on success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await apiFetch<{ ok: boolean }>("/items");
    expect(result).toEqual({ ok: true });
  });

  it("calls fetch with the given path and no base prefix by default", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    vi.stubGlobal("fetch", fetchMock);
    await apiFetch("/apps?page=1");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/apps?page=1");
    expect((init.signal as AbortSignal).aborted).toBe(false);
  });

  it("throws ApiError with parsed message from JSON error body", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ message: "Nope" }, 404)));
    const error = await apiFetch("/missing").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(404);
    expect((error as ApiError).message).toBe("Nope");
    expect((error as ApiError).path).toBe("/missing");
  });

  it("falls back to raw text when error body is not JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(textResponse("Bad gateway", 502)));
    const error = await apiFetch("/x").catch((e: unknown) => e);
    expect((error as ApiError).message).toBe("Bad gateway");
  });

  it("falls back to generic message when error body is empty", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(textResponse("", 500)));
    const error = await apiFetch("/x").catch((e: unknown) => e);
    expect((error as ApiError).message).toBe("Request failed with status 500");
  });

  it("throws ApiError on timeout", async () => {
    const fetchMock = vi.fn().mockImplementation(
      (_url: string, init: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener("abort", () =>
            reject(new DOMException("The operation was aborted.", "AbortError")),
          );
        }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const error = await apiFetch("/slow", { timeoutMs: 20 }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(0);
    expect((error as ApiError).message).toBe("Request timed out after 20ms");
  });

  it("uses the default timeout of 30s", () => {
    expect(DEFAULT_REQUEST_TIMEOUT_MS).toBe(30000);
  });

  it("injects the Authorization header when getAuthHeader resolves", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    vi.stubGlobal("fetch", fetchMock);
    await apiFetch("/secure", { getAuthHeader: () => "Bearer token123" });
    const [, init] = fetchMock.mock.calls[0] as [string, { headers: Headers }];
    expect(init.headers.get("Authorization")).toBe("Bearer token123");
  });

  it("supports async getAuthHeader", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    vi.stubGlobal("fetch", fetchMock);
    await apiFetch("/secure", { getAuthHeader: async () => "Bearer async" });
    const [, init] = fetchMock.mock.calls[0] as [string, { headers: Headers }];
    expect(init.headers.get("Authorization")).toBe("Bearer async");
  });

  it("skips Authorization header when getAuthHeader returns undefined", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    vi.stubGlobal("fetch", fetchMock);
    await apiFetch("/open", { getAuthHeader: () => undefined });
    const [, init] = fetchMock.mock.calls[0] as [string, { headers: Headers }];
    expect(init.headers.has("Authorization")).toBe(false);
  });

  it("rethrows non-abort fetch errors unchanged", async () => {
    const networkError = new TypeError("fetch failed");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(networkError));
    await expect(apiFetch("/x")).rejects.toBe(networkError);
  });
});

describe("postJson", () => {
  it("sends JSON body with Content-Type header", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: 1 }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await postJson<{ id: number }>("/items", "POST", { name: "a" });
    expect(result).toEqual({ id: 1 });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/items");
    expect(init.method).toBe("POST");
    expect(new Headers(init.headers).get("Content-Type")).toBe("application/json");
    expect(init.body).toBe(JSON.stringify({ name: "a" }));
  });

  it("merges extra headers without dropping Content-Type", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    vi.stubGlobal("fetch", fetchMock);
    await postJson("/items", "POST", {}, { headers: { "X-Custom": "yes" } });
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(init.headers);
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(headers.get("X-Custom")).toBe("yes");
  });
});

describe("apiPost / apiPut / apiPatch", () => {
  it.each([
    ["apiPost", apiPost, "POST"],
    ["apiPut", apiPut, "PUT"],
    ["apiPatch", apiPatch, "PATCH"],
  ] as const)("%s uses %s method", async (_name, fn, method) => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    vi.stubGlobal("fetch", fetchMock);
    await fn("/items", { a: 1 });
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe(method);
    expect(init.body).toBe(JSON.stringify({ a: 1 }));
  });
});
