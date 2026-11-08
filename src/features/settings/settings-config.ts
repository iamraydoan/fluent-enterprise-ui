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

export interface BrandPreset {
  background: string;
  foreground: string;
  stroke: string;
}

export const BRAND_PRESETS: Record<BrandId, BrandPreset> = {
  blue: { background: "#0f6cbd", foreground: "#1a6fc4", stroke: "#0f6cbd" },
  teal: { background: "#038387", foreground: "#026f73", stroke: "#038387" },
  violet: { background: "#6b4fbb", foreground: "#5b3fa8", stroke: "#6b4fbb" },
  orange: { background: "#ca5010", foreground: "#b34710", stroke: "#ca5010" },
  green: { background: "#107c10", foreground: "#0e700e", stroke: "#107c10" },
};

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

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  brand: "blue",
  scheme: "light",
  radius: "default",
  density: "comfortable",
  sidebarLayout: "collapsed",
  contentWidth: "full",
};
