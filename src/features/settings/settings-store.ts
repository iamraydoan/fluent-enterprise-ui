import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_THEME_SETTINGS } from "./settings-config";
import type {
  BrandId,
  ColorSchemeId,
  ContentWidthId,
  DensityId,
  RadiusId,
  SidebarLayout,
  ThemeSettings,
} from "./settings-config";

export const THEME_SETTINGS_STORAGE_KEY = "fluent-enterprise-ui:theme-settings";

export interface ThemeSettingsState extends ThemeSettings {
  setBrand: (brand: BrandId) => void;
  setScheme: (scheme: ColorSchemeId) => void;
  setRadius: (radius: RadiusId) => void;
  setDensity: (density: DensityId) => void;
  setSidebarLayout: (sidebarLayout: SidebarLayout) => void;
  toggleSidebarLayout: () => void;
  setContentWidth: (contentWidth: ContentWidthId) => void;
  resetThemeSettings: () => void;
}

function persistedSettings(state: ThemeSettingsState): ThemeSettings {
  return {
    brand: state.brand,
    scheme: state.scheme,
    radius: state.radius,
    density: state.density,
    sidebarLayout: state.sidebarLayout,
    contentWidth: state.contentWidth,
  };
}

export const useThemeSettingsStore = create<ThemeSettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_THEME_SETTINGS,
      setBrand: (brand) => set({ brand }),
      setScheme: (scheme) => set({ scheme }),
      setRadius: (radius) => set({ radius }),
      setDensity: (density) => set({ density }),
      setSidebarLayout: (sidebarLayout) => set({ sidebarLayout }),
      toggleSidebarLayout: () =>
        set((state) => ({
          sidebarLayout: state.sidebarLayout === "expanded" ? "collapsed" : "expanded",
        })),
      setContentWidth: (contentWidth) => set({ contentWidth }),
      resetThemeSettings: () => set({ ...DEFAULT_THEME_SETTINGS }),
    }),
    { name: THEME_SETTINGS_STORAGE_KEY, partialize: persistedSettings },
  ),
);
