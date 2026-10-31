import { describe, expect, it } from "vitest";
import { RecordState } from "@/lib/recordState";

describe("RecordState", () => {
  it("defines exactly the Active, Draft and Terminated states", () => {
    expect(Object.values(RecordState).sort()).toEqual(["Active", "Draft", "Terminated"]);
  });

  it("uses the member name as its value", () => {
    expect(RecordState.Active).toBe("Active");
    expect(RecordState.Draft).toBe("Draft");
    expect(RecordState.Terminated).toBe("Terminated");
  });
});
