import { webDarkTheme, webLightTheme } from "@fluentui/react-components";
import type { Theme } from "@fluentui/react-components";

export type AppTheme = Theme;

const fontFamilyBase = `"Noto Sans","Segoe UI",system-ui,sans-serif`;

export const lightTheme: AppTheme = {
  ...webLightTheme,
  fontFamilyBase,
  colorBrandForeground1: "#1a6fc4",
  colorBrandForegroundLink: "#1a6fc4",
};

export const darkTheme: AppTheme = {
  ...webDarkTheme,
  fontFamilyBase,
  colorBrandForeground1: "#1a6fc4",
  colorBrandForegroundLink: "#1a6fc4",
};

export const theme = lightTheme;
