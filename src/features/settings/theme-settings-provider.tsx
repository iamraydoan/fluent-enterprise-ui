import { useMemo } from "react";
import type { ReactNode } from "react";
import { makeStyles, mergeClasses } from "@/components/ui";
import { darkTheme, lightTheme } from "@/theme";
import type { AppTheme } from "@/theme";
import { BRAND_PRESETS, DENSITY_TOKENS, RADIUS_TOKENS } from "./settings-config";
import { useThemeSettingsStore } from "./settings-store";
import { ThemeSettingsContext } from "./theme-settings-context";

const useStyles = makeStyles({
  shell: { minHeight: "100vh" },
  narrow: { maxWidth: "1200px", margin: "0 auto" },
});

export function ThemeSettingsProvider({ children }: { children: ReactNode }) {
  const brand = useThemeSettingsStore((state) => state.brand);
  const scheme = useThemeSettingsStore((state) => state.scheme);
  const radius = useThemeSettingsStore((state) => state.radius);
  const density = useThemeSettingsStore((state) => state.density);
  const contentWidth = useThemeSettingsStore((state) => state.contentWidth);
  const styles = useStyles();
  const theme = useMemo<AppTheme>(() => {
    const base = scheme === "dark" ? darkTheme : lightTheme;
    const preset = BRAND_PRESETS[brand];
    return {
      ...base,
      colorBrandBackground: preset.background,
      colorBrandBackgroundHover: preset.background,
      colorBrandBackgroundPressed: preset.background,
      colorBrandBackgroundSelected: preset.background,
      colorBrandForeground1: preset.foreground,
      colorBrandForegroundLink: preset.foreground,
      colorBrandForegroundLinkHover: preset.foreground,
      colorBrandForegroundLinkPressed: preset.foreground,
      colorBrandStroke1: preset.stroke,
      ...RADIUS_TOKENS[radius],
      ...DENSITY_TOKENS[density],
    };
  }, [brand, scheme, radius, density]);
  return (
    <ThemeSettingsContext.Provider value={theme}>
      <div
        id="theme-shell"
        className={mergeClasses(styles.shell, contentWidth === "narrow" && styles.narrow)}
      >
        {children}
      </div>
    </ThemeSettingsContext.Provider>
  );
}
