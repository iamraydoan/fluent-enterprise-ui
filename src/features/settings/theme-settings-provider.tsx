import { useMemo } from "react";
import type { ReactNode } from "react";
import { makeStyles, mergeClasses } from "@/components/ui";
import { useThemeSettingsStore } from "./settings-store";
import { buildAppTheme } from "./theme-builder";
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
  const theme = useMemo(
    () => buildAppTheme({ brand, scheme, radius, density }),
    [brand, scheme, radius, density],
  );
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
