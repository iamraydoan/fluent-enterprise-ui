import { createContext, useContext } from "react";
import { lightTheme } from "@/theme";
import type { AppTheme } from "@/theme";

export const ThemeSettingsContext = createContext<AppTheme>(lightTheme);

export function useThemeSettingsTheme(): AppTheme {
  return useContext(ThemeSettingsContext);
}
