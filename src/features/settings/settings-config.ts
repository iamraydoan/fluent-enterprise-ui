import type { TranslationKey } from "@/i18n";

export type BrandId = "blue" | "teal" | "violet" | "orange" | "green";
export type ColorSchemeId = "light" | "dark";
export type RadiusId = "default" | "square" | "round";
export type DensityId = "comfortable" | "compact";
export type SidebarLayout = "expanded" | "collapsed";
export type ContentWidthId = "full" | "narrow";

export interface ThemeSettings {
  brand: BrandId;
  scheme: ColorSchemeId;
  radius: RadiusId;
  density: DensityId;
  sidebarLayout: SidebarLayout;
  contentWidth: ContentWidthId;
}

export interface SettingOption<T extends string> {
  value: T;
  labelKey: TranslationKey;
}

export interface BrandShades {
  background: string;
  backgroundHover: string;
  backgroundPressed: string;
  backgroundSelected: string;
  foreground: string;
  foregroundHover: string;
  foregroundPressed: string;
  stroke: string;
}

export const BRAND_OPTIONS: SettingOption<BrandId>[] = [
  { value: "blue", labelKey: "settings.brand.blue" },
  { value: "teal", labelKey: "settings.brand.teal" },
  { value: "violet", labelKey: "settings.brand.violet" },
  { value: "orange", labelKey: "settings.brand.orange" },
  { value: "green", labelKey: "settings.brand.green" },
];

export const SCHEME_OPTIONS: SettingOption<ColorSchemeId>[] = [
  { value: "light", labelKey: "settings.scheme.light" },
  { value: "dark", labelKey: "settings.scheme.dark" },
];

export const RADIUS_OPTIONS: SettingOption<RadiusId>[] = [
  { value: "default", labelKey: "settings.radius.default" },
  { value: "square", labelKey: "settings.radius.square" },
  { value: "round", labelKey: "settings.radius.round" },
];

export const DENSITY_OPTIONS: SettingOption<DensityId>[] = [
  { value: "comfortable", labelKey: "settings.density.comfortable" },
  { value: "compact", labelKey: "settings.density.compact" },
];

export const SIDEBAR_OPTIONS: SettingOption<SidebarLayout>[] = [
  { value: "collapsed", labelKey: "settings.sidebar.collapsed" },
  { value: "expanded", labelKey: "settings.sidebar.expanded" },
];

export const CONTENT_WIDTH_OPTIONS: SettingOption<ContentWidthId>[] = [
  { value: "full", labelKey: "settings.contentWidth.full" },
  { value: "narrow", labelKey: "settings.contentWidth.narrow" },
];

const BRAND_VALUES = BRAND_OPTIONS.map((option) => option.value);
const SCHEME_VALUES = SCHEME_OPTIONS.map((option) => option.value);
const RADIUS_VALUES = RADIUS_OPTIONS.map((option) => option.value);
const DENSITY_VALUES = DENSITY_OPTIONS.map((option) => option.value);
const SIDEBAR_VALUES = SIDEBAR_OPTIONS.map((option) => option.value);
const CONTENT_WIDTH_VALUES = CONTENT_WIDTH_OPTIONS.map((option) => option.value);

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  brand: "blue",
  scheme: "light",
  radius: "default",
  density: "comfortable",
  sidebarLayout: "collapsed",
  contentWidth: "full",
};

export const BRAND_PRESETS: Record<BrandId, Record<ColorSchemeId, BrandShades | null>> = {
  blue: { light: null, dark: null },
  teal: {
    light: {
      background: "#038387",
      backgroundHover: "#026e72",
      backgroundPressed: "#01484a",
      backgroundSelected: "#026064",
      foreground: "#016b6f",
      foregroundHover: "#015a5e",
      foregroundPressed: "#013f42",
      stroke: "#038387",
    },
    dark: {
      background: "#0f6c70",
      backgroundHover: "#0a9095",
      backgroundPressed: "#0b5256",
      backgroundSelected: "#0d7a7f",
      foreground: "#3fd2d8",
      foregroundHover: "#63e0e5",
      foregroundPressed: "#2bb3b8",
      stroke: "#3fd2d8",
    },
  },
  violet: {
    light: {
      background: "#6b4fbb",
      backgroundHover: "#5b3fa8",
      backgroundPressed: "#3b2870",
      backgroundSelected: "#4f3591",
      foreground: "#5b3fa8",
      foregroundHover: "#4a3488",
      foregroundPressed: "#33235e",
      stroke: "#6b4fbb",
    },
    dark: {
      background: "#6b4fbb",
      backgroundHover: "#8168cc",
      backgroundPressed: "#4c3685",
      backgroundSelected: "#5f45a8",
      foreground: "#b3a0e8",
      foregroundHover: "#c7b8f0",
      foregroundPressed: "#9c86e0",
      stroke: "#b3a0e8",
    },
  },
  orange: {
    light: {
      background: "#ca5010",
      backgroundHover: "#b34710",
      backgroundPressed: "#7a2f0a",
      backgroundSelected: "#9c3d0e",
      foreground: "#b34710",
      foregroundHover: "#9c3d0e",
      foregroundPressed: "#6b290a",
      stroke: "#ca5010",
    },
    dark: {
      background: "#ca5010",
      backgroundHover: "#e06a2a",
      backgroundPressed: "#96380a",
      backgroundSelected: "#b0460d",
      foreground: "#f4a678",
      foregroundHover: "#f8bd9a",
      foregroundPressed: "#ef8f57",
      stroke: "#f4a678",
    },
  },
  green: {
    light: {
      background: "#107c10",
      backgroundHover: "#0e700e",
      backgroundPressed: "#083f08",
      backgroundSelected: "#0c660c",
      foreground: "#0e700e",
      foregroundHover: "#0c660c",
      foregroundPressed: "#083f08",
      stroke: "#107c10",
    },
    dark: {
      background: "#107c10",
      backgroundHover: "#1a9a1a",
      backgroundPressed: "#0b560b",
      backgroundSelected: "#0e700e",
      foreground: "#6ccb6c",
      foregroundHover: "#8fdc8f",
      foregroundPressed: "#4fb84f",
      stroke: "#6ccb6c",
    },
  },
};

export const RADIUS_TOKENS: Record<RadiusId, Record<string, string>> = {
  default: {},
  square: {
    borderRadiusSmall: "0",
    borderRadiusMedium: "0",
    borderRadiusLarge: "0",
    borderRadiusXLarge: "0",
  },
  round: {
    borderRadiusSmall: "4px",
    borderRadiusMedium: "10px",
    borderRadiusLarge: "14px",
    borderRadiusXLarge: "18px",
  },
};

export const DENSITY_TOKENS: Record<DensityId, Record<string, string>> = {
  comfortable: {},
  compact: {
    spacingHorizontalXS: "3px",
    spacingHorizontalS: "6px",
    spacingHorizontalM: "9px",
    spacingHorizontalL: "12px",
    spacingHorizontalXL: "18px",
    spacingHorizontalXXL: "24px",
    spacingHorizontalXXXL: "28px",
    spacingVerticalXS: "3px",
    spacingVerticalS: "6px",
    spacingVerticalM: "9px",
    spacingVerticalL: "12px",
    spacingVerticalXL: "18px",
    spacingVerticalXXL: "24px",
    spacingVerticalXXXL: "28px",
  },
};

function pickValue<T extends string>(values: readonly T[], value: unknown, fallback: T): T {
  return typeof value === "string" && (values as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

export function sanitizeThemeSettings(input: unknown): ThemeSettings {
  const candidate =
    typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
  return {
    brand: pickValue(BRAND_VALUES, candidate.brand, DEFAULT_THEME_SETTINGS.brand),
    scheme: pickValue(SCHEME_VALUES, candidate.scheme, DEFAULT_THEME_SETTINGS.scheme),
    radius: pickValue(RADIUS_VALUES, candidate.radius, DEFAULT_THEME_SETTINGS.radius),
    density: pickValue(DENSITY_VALUES, candidate.density, DEFAULT_THEME_SETTINGS.density),
    sidebarLayout: pickValue(
      SIDEBAR_VALUES,
      candidate.sidebarLayout,
      DEFAULT_THEME_SETTINGS.sidebarLayout,
    ),
    contentWidth: pickValue(
      CONTENT_WIDTH_VALUES,
      candidate.contentWidth,
      DEFAULT_THEME_SETTINGS.contentWidth,
    ),
  };
}
