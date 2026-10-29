import { describe, expect, it } from "vitest";
import en from "./locales/en.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import vi from "./locales/vi.json";

type Locale = Record<string, unknown>;

function flattenKeys(node: unknown, prefix = ""): string[] {
  if (typeof node !== "object" || node === null) return [prefix];
  return Object.entries(node as Locale).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

function valueAt(root: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (node, key) =>
        typeof node === "object" && node !== null ? (node as Locale)[key] : undefined,
      root,
    );
}

function placeholders(text: string): string[] {
  return [...text.matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1]).sort();
}

const OTHER_LOCALES: Array<[string, Locale]> = [
  ["vi", vi as Locale],
  ["ja", ja as Locale],
  ["ko", ko as Locale],
];

describe("locale key consistency", () => {
  it("ships identical key sets for every language", () => {
    const expected = flattenKeys(en).sort();
    expect(expected.length).toBeGreaterThan(0);
    for (const [code, locale] of OTHER_LOCALES) {
      expect(flattenKeys(locale).sort(), `keys of ${code}`).toEqual(expected);
    }
  });

  it("keeps every interpolation placeholder identical across languages", () => {
    for (const path of flattenKeys(en)) {
      const source = valueAt(en, path);
      if (typeof source !== "string") continue;
      for (const [code, locale] of OTHER_LOCALES) {
        const translated = valueAt(locale, path);
        expect(typeof translated, `${code}:${path}`).toBe("string");
        expect(placeholders(translated as string), `${code}:${path}`).toEqual(placeholders(source));
      }
    }
  });
});
