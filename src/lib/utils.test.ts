import { describe, expect, it } from "vitest";
import { containsIgnoreCase, formatList } from "@/lib/utils";

describe("containsIgnoreCase", () => {
  it("matches an empty query against any text", () => {
    expect(containsIgnoreCase("Entity Types", "")).toBe(true);
  });

  it("matches regardless of case", () => {
    expect(containsIgnoreCase("CM MES Agent", "mes")).toBe(true);
    expect(containsIgnoreCase("CM MES Agent", "MES")).toBe(true);
    expect(containsIgnoreCase("CM MES Agent", "Agent")).toBe(true);
  });

  it("rejects text that does not contain the query", () => {
    expect(containsIgnoreCase("CM MES Agent", "quality")).toBe(false);
  });

  it("matches a substring in the middle of the text", () => {
    expect(containsIgnoreCase("Quality Assistant", "assist")).toBe(true);
  });
});

describe("formatList", () => {
  it("joins items with a comma and space", () => {
    expect(formatList(["Mixing", "Moulding", "Baking"])).toBe("Mixing, Moulding, Baking");
  });

  it("returns the single item unchanged", () => {
    expect(formatList(["Mixing"])).toBe("Mixing");
  });

  it("returns an empty string for no items", () => {
    expect(formatList([])).toBe("");
  });
});
