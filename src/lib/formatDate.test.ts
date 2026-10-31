import { describe, expect, it } from "vitest";
import { formatDateTime } from "@/lib/formatDate";

describe("formatDateTime", () => {
  it("formats the unix epoch in US date-time style", () => {
    expect(formatDateTime(0)).toBe("1/1/1970 12:00:00 AM");
  });

  it("formats an afternoon timestamp with 12-hour clock", () => {
    expect(formatDateTime(Date.UTC(2026, 9, 31, 14, 30, 45))).toBe("10/31/2026 2:30:45 PM");
  });

  it("renders midnight as 12 AM", () => {
    expect(formatDateTime(Date.UTC(2026, 0, 1, 0, 0, 0))).toBe("1/1/2026 12:00:00 AM");
  });

  it("renders noon as 12 PM", () => {
    expect(formatDateTime(Date.UTC(2026, 0, 1, 12, 0, 0))).toBe("1/1/2026 12:00:00 PM");
  });

  it("pads single-digit minutes and seconds", () => {
    expect(formatDateTime(Date.UTC(2026, 5, 9, 8, 5, 7))).toBe("6/9/2026 8:05:07 AM");
  });

  it("is timezone-independent (uses UTC)", () => {
    const expected = "3/15/2026 11:59:59 PM";
    expect(formatDateTime(Date.UTC(2026, 2, 15, 23, 59, 59))).toBe(expected);
  });
});
