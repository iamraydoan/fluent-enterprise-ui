import { describe, expect, it } from "vitest";
import type { TranslationKey } from "@/i18n";
import { enumOptions } from "@/lib/enum";

const LABELS = {
  up: "common.search",
  down: "common.cancel",
  maintenance: "common.close",
} as Record<"up" | "down" | "maintenance", TranslationKey>;

describe("enumOptions", () => {
  it("maps every value to its label key in order", () => {
    expect(enumOptions(["up", "down"] as const, LABELS)).toEqual([
      { value: "up", labelKey: "common.search" },
      { value: "down", labelKey: "common.cancel" },
    ]);
  });

  it("returns an empty array for no values", () => {
    expect(enumOptions([] as const, LABELS)).toEqual([]);
  });

  it("covers all values of the enum", () => {
    const values = ["up", "down", "maintenance"] as const;
    const options = enumOptions(values, LABELS);
    expect(options.map((option) => option.value).sort()).toEqual(["down", "maintenance", "up"]);
  });
});
