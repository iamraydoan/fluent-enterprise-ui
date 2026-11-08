import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ToastHost } from "@/components/common";
import { Button, makeStyles, Text } from "@/components/ui";
import { NAVIGATION_SECTIONS, routeForSection, sectionForRoute } from "@/data/navigation";
import { useThemeSettingsStore } from "@/features/settings/settings-store";
import { useAppTranslation } from "@/i18n";
import { PageTabs } from "@/layouts/PageTabs";
import { Sidebar } from "@/layouts/Sidebar";
import { useTabsStore } from "@/stores/tabs-store";
import type { PageTab } from "@/stores/tabs-store";
import { cardSurface } from "@/styles/shared";
import { theme } from "@/styles/theme";

const useStyles = makeStyles({
  layoutGrid: {
    display: "grid",
    height: "100vh",
    backgroundColor: "#DDE1E7",
    color: "#222",
    transitionProperty: "grid-template-columns",
    transitionDuration: "180ms",
  },
  mainColumn: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    minHeight: 0,
    padding: "0 5px 5px",
  },
  welcome: {
    flexGrow: 1,
    ...cardSurface,
    borderRadius: "0 0 12px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: "10px",
    color: theme.color.textTertiary,
  },
});

const ADMINISTRATION_SECTION_ID = "administration";

const SETTINGS_TAB: PageTab = {
  id: "settings",
  route: "/settings",
  titleKey: "settings.title",
  title: null,
  parentRoute: null,
};

export function MainLayout() {
  const layoutStyles = useStyles();
  const { t } = useAppTranslation();
  const sidebarLayout = useThemeSettingsStore((state) => state.sidebarLayout);
  const toggleSidebarLayout = useThemeSettingsStore((state) => state.toggleSidebarLayout);
  const expanded = sidebarLayout === "expanded";
  const tabs = useTabsStore((state) => state.tabs);
  const active = useTabsStore((state) => state.active);
  const openRoute = useTabsStore((state) => state.openRoute);
  const addTab = useTabsStore((state) => state.addTab);
  const openTab = useTabsStore((state) => state.openTab);
  const closeTab = useTabsStore((state) => state.closeTab);
  const backFromTab = useTabsStore((state) => state.backFromTab);
  const setActive = useTabsStore((state) => state.setActive);
  const syncRoute = useTabsStore((state) => state.syncRoute);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === SETTINGS_TAB.route) {
      openTab(SETTINGS_TAB);
      return;
    }
    syncRoute(location.pathname);
  }, [location.pathname, syncRoute, openTab]);

  const currentTab = tabs.find((tab) => tab.id === active);
  const currentSection = currentTab ? sectionForRoute(currentTab.route) : undefined;

  const handleNavigate = (sectionId: string) => {
    const route = routeForSection(sectionId);
    if (!route) return;
    openRoute(route);
    navigate({ to: route });
  };
  const handleSelect = (id: string) => {
    const tab = tabs.find((candidate) => candidate.id === id);
    if (!tab) return;
    setActive(id);
    navigate({ to: tab.route });
  };
  const handleNewTab = () => {
    addTab();
    navigate({ to: "/administration" });
  };
  const handleClose = (id: string) => {
    const nextActive = closeTab(id);
    if (!nextActive) {
      navigate({ to: "/administration" });
      return;
    }
    const nextTab = useTabsStore.getState().tabs.find((candidate) => candidate.id === nextActive);
    if (nextTab) navigate({ to: nextTab.route });
  };
  const handleBack = (tab: PageTab) => {
    if (!tab.parentRoute) return;
    const parent = backFromTab(tab);
    if (!parent) return;
    const parentTab = useTabsStore.getState().tabs.find((candidate) => candidate.id === parent);
    if (parentTab) navigate({ to: parentTab.route });
  };

  return (
    <div
      className={layoutStyles.layoutGrid}
      style={{ gridTemplateColumns: `${expanded ? 220 : 48}px minmax(0,1fr)` }}
    >
      <Sidebar
        expanded={expanded}
        onToggleExpanded={toggleSidebarLayout}
        items={NAVIGATION_SECTIONS}
        currentNav={currentSection?.id}
        onNavigate={handleNavigate}
      />
      <div className={layoutStyles.mainColumn}>
        <PageTabs
          tabs={tabs}
          active={active}
          onSelect={handleSelect}
          onBack={handleBack}
          onClose={handleClose}
          onNewTab={handleNewTab}
        />
        {!currentTab && (
          <div className={layoutStyles.welcome}>
            <Text weight="semibold" size={400}>
              {t("mainLayout.noOpenTabs")}
            </Text>
            <Button variant="primary" onClick={() => handleNavigate(ADMINISTRATION_SECTION_ID)}>
              {t("mainLayout.openAdministration")}
            </Button>
          </div>
        )}
        {currentTab && <Outlet />}
      </div>
      <ToastHost />
    </div>
  );
}
