import { darkTheme, lightTheme } from "@/theme";
import type { AppTheme } from "@/theme";
import {
  BRAND_PRESETS,
  DENSITY_TOKENS,
  RADIUS_TOKENS,
  sanitizeThemeSettings,
} from "./settings-config";
import type { BrandShades, ThemeSettings } from "./settings-config";

function brandOverrides(shades: BrandShades): Record<string, string> {
  return {
    colorBrandBackground: shades.background,
    colorBrandBackgroundHover: shades.backgroundHover,
    colorBrandBackgroundPressed: shades.backgroundPressed,
    colorBrandBackgroundSelected: shades.backgroundSelected,
    colorBrandForeground1: shades.foreground,
    colorBrandForeground2: shades.foregroundHover,
    colorBrandForegroundLink: shades.foreground,
    colorBrandForegroundLinkHover: shades.foregroundHover,
    colorBrandForegroundLinkPressed: shades.foregroundPressed,
    colorBrandStroke1: shades.stroke,
    colorCompoundBrandBackground: shades.background,
    colorCompoundBrandBackgroundHover: shades.backgroundHover,
    colorCompoundBrandBackgroundPressed: shades.backgroundSelected,
    colorNeutralForeground2BrandHover: shades.foreground,
    colorNeutralForeground2BrandPressed: shades.foregroundHover,
  };
}

export function buildAppTheme(
  settings: Pick<ThemeSettings, "brand" | "scheme" | "radius" | "density">,
): AppTheme {
  const normalized = sanitizeThemeSettings(settings);
  const base = normalized.scheme === "dark" ? darkTheme : lightTheme;
  const shades = BRAND_PRESETS[normalized.brand][normalized.scheme];
  const overrides: Record<string, string> = {
    ...(shades ? brandOverrides(shades) : {}),
    ...RADIUS_TOKENS[normalized.radius],
    ...DENSITY_TOKENS[normalized.density],
  };
  return Object.keys(overrides).length === 0 ? base : { ...base, ...overrides };
}
