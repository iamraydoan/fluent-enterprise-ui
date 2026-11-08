import { describe, expect, it } from "vitest";
import { darkTheme, lightTheme } from "@/theme";
import { DEFAULT_THEME_SETTINGS, sanitizeThemeSettings } from "./settings-config";
import { buildAppTheme } from "./theme-builder";

const NON_DEFAULT_BRANDS = ["teal", "violet", "orange", "green"] as const;
const SCHEMES = ["light", "dark"] as const;

describe("buildAppTheme", () => {
  it("is deep-equal to the base theme at defaults for both schemes", () => {
    expect(buildAppTheme(DEFAULT_THEME_SETTINGS)).toEqual(lightTheme);
    expect(buildAppTheme({ ...DEFAULT_THEME_SETTINGS, scheme: "dark" })).toEqual(darkTheme);
  });

  it("keeps every non-default brand interactive in both schemes", () => {
    for (const brand of NON_DEFAULT_BRANDS) {
      for (const scheme of SCHEMES) {
        const theme = buildAppTheme({ ...DEFAULT_THEME_SETTINGS, brand, scheme });
        expect(theme.colorBrandBackgroundHover, brand + " hover").not.toBe(
          theme.colorBrandBackground,
        );
        expect(theme.colorBrandBackgroundPressed, brand + " pressed").not.toBe(
          theme.colorBrandBackground,
        );
        expect(theme.colorBrandBackgroundSelected, brand + " selected").not.toBe(
          theme.colorBrandBackground,
        );
        expect(theme.colorBrandForegroundLinkHover, brand + " link hover").not.toBe(
          theme.colorBrandForegroundLink,
        );
        expect(theme.colorBrandForegroundLinkPressed, brand + " link pressed").not.toBe(
          theme.colorBrandForegroundLink,
        );
      }
    }
  });

  it("falls back to the base theme when the settings are hostile", () => {
    const hostile = {
      brand: "bogus",
      scheme: 42,
      radius: null,
      density: [],
    } as unknown as Parameters<typeof buildAppTheme>[0];
    expect(buildAppTheme(hostile)).toEqual(lightTheme);
  });
});

describe("sanitizeThemeSettings", () => {
  it("returns defaults for non-object payloads", () => {
    expect(sanitizeThemeSettings(undefined)).toEqual(DEFAULT_THEME_SETTINGS);
    expect(sanitizeThemeSettings(null)).toEqual(DEFAULT_THEME_SETTINGS);
    expect(sanitizeThemeSettings("nope")).toEqual(DEFAULT_THEME_SETTINGS);
    expect(sanitizeThemeSettings(42)).toEqual(DEFAULT_THEME_SETTINGS);
    expect(sanitizeThemeSettings([1, 2])).toEqual(DEFAULT_THEME_SETTINGS);
  });

  it("coerces unknown values per field", () => {
    expect(
      sanitizeThemeSettings({
        brand: "bogus",
        scheme: true,
        radius: [],
        density: {},
        sidebarLayout: 7,
        contentWidth: "wide",
      }),
    ).toEqual(DEFAULT_THEME_SETTINGS);
  });

  it("keeps valid values and fills missing fields", () => {
    expect(sanitizeThemeSettings({ brand: "teal", radius: "round" })).toEqual({
      ...DEFAULT_THEME_SETTINGS,
      brand: "teal",
      radius: "round",
    });
  });
});
