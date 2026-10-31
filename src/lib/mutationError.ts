export const MUTATION_ERROR_EVENT = "app:mutation-error";

export interface MutationErrorInfo {
  path: string;
  status: number;
  message: string;
}

export function toMutationErrorInfo(error: unknown): MutationErrorInfo {
  if (error instanceof Error && "status" in error && typeof error.status === "number") {
    const path = "path" in error && typeof error.path === "string" ? error.path : "";
    return { path, status: error.status, message: error.message };
  }
  if (error instanceof Error) {
    return { path: "", status: 0, message: error.message };
  }
  return { path: "", status: 0, message: "Unknown error" };
}

export function handleMutationError(error: unknown): void {
  window.dispatchEvent(
    new CustomEvent<MutationErrorInfo>(MUTATION_ERROR_EVENT, {
      detail: toMutationErrorInfo(error),
    }),
  );
}
