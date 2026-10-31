export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export const DEFAULT_REQUEST_TIMEOUT_MS = 30000;

export class ApiError extends Error {
  readonly status: number;
  readonly path: string;

  constructor(status: number, message: string, path = "") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.path = path;
  }
}

export interface ApiRequestInit extends Omit<RequestInit, "signal"> {
  timeoutMs?: number;
  getAuthHeader?: () => string | undefined | Promise<string | undefined>;
}

async function parseErrorMessage(response: Response): Promise<string> {
  let text: string;
  try {
    text = await response.text();
  } catch {
    return `Request failed with status ${response.status}`;
  }
  if (text) {
    try {
      const body = JSON.parse(text) as { message?: unknown };
      if (body && typeof body.message === "string" && body.message.length > 0) {
        return body.message;
      }
    } catch {
      return text;
    }
  }
  return `Request failed with status ${response.status}`;
}

export async function apiFetch<T>(path: string, init?: ApiRequestInit): Promise<T> {
  const { timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS, getAuthHeader, ...fetchInit } = init ?? {};
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers = new Headers(fetchInit.headers);
  if (getAuthHeader) {
    const authHeader = await getAuthHeader();
    if (authHeader) {
      headers.set("Authorization", authHeader);
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchInit,
      headers,
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new ApiError(response.status, await parseErrorMessage(response), path);
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(0, `Request timed out after ${timeoutMs}ms`, path);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function postJson<T>(
  path: string,
  method: string,
  body: unknown,
  init?: ApiRequestInit,
): Promise<T> {
  return apiFetch<T>(path, {
    ...init,
    method,
    headers: { "Content-Type": "application/json", ...init?.headers },
    body: JSON.stringify(body),
  });
}

export function apiPost<T>(path: string, body: unknown, init?: ApiRequestInit): Promise<T> {
  return postJson<T>(path, "POST", body, init);
}

export function apiPut<T>(path: string, body: unknown, init?: ApiRequestInit): Promise<T> {
  return postJson<T>(path, "PUT", body, init);
}

export function apiPatch<T>(path: string, body: unknown, init?: ApiRequestInit): Promise<T> {
  return postJson<T>(path, "PATCH", body, init);
}

export {
  MUTATION_ERROR_EVENT,
  handleMutationError,
  toMutationErrorInfo,
} from "@/lib/mutationError";
export type { MutationErrorInfo } from "@/lib/mutationError";
