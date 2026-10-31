import { describe, expect, it } from "vitest";
import { toMutationErrorInfo } from "@/lib/mutationError";

describe("toMutationErrorInfo", () => {
  it("extracts path, status, and message from ApiError-like errors", () => {
    const error = Object.assign(new Error("Not found"), { status: 404, path: "/api/items" });
    expect(toMutationErrorInfo(error)).toEqual({
      path: "/api/items",
      status: 404,
      message: "Not found",
    });
  });

  it("defaults path to empty string when missing", () => {
    const error = Object.assign(new Error("Server error"), { status: 500 });
    const info = toMutationErrorInfo(error);
    expect(info.path).toBe("");
    expect(info.status).toBe(500);
  });

  it("handles plain errors without status", () => {
    const info = toMutationErrorInfo(new Error("Network failure"));
    expect(info).toEqual({ path: "", status: 0, message: "Network failure" });
  });

  it("handles non-error values", () => {
    expect(toMutationErrorInfo("oops")).toEqual({
      path: "",
      status: 0,
      message: "Unknown error",
    });
    expect(toMutationErrorInfo(null)).toEqual({
      path: "",
      status: 0,
      message: "Unknown error",
    });
  });
});
