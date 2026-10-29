import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button, makeStyles, Text, tokens } from "@/components/ui";
import { NAVIGATION_ITEMS, getNavigationItem, routeForNav, routeForTab } from "@/data/navigation";
import { PageTabs } from "@/layouts/PageTabs";
import { Sidebar } from "@/layouts/Sidebar";
import { useTabsStore } from "@/stores/tabs-store";
import type { PageTab } from "@/stores/tabs-store";

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
    backgroundColor: "#FAFAFA",
    borderRadius: "0 0 12px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: "10px",
    color: tokens.colorNeutralForeground3,
  },
});

export function MainLayout() {
  const layoutStyles = useStyles();
  const [expanded, setExpanded] = useState(false);
  const tabs = useTabsStore((state) => state.tabs);
  const active = useTabsStore((state) => state.active);
  const openNav = useTabsStore((state) => state.openNav);
  const closeTab = useTabsStore((state) => state.closeTab);
  const backFromDetail = useTabsStore((state) => state.backFromDetail);
  const setActive = useTabsStore((state) => state.setActive);
  const syncRoute = useTabsStore((state) => state.syncRoute);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    syncRoute(location.pathname);
  }, [location.pathname, syncRoute]);

  const currentTab = tabs.find((tab) => tab.id === active);

  const handleNavigate = (navigationId: string) => {
    if (!getNavigationItem(navigationId)) return;
    openNav(navigationId);
    navigate({ to: routeForNav(navigationId) });
  };
  const handleSelect = (id: string) => {
    const tab = tabs.find((candidate) => candidate.id === id);
    if (!tab) return;
    setActive(id);
    navigate({ to: routeForTab(tab) });
  };
  const handleClose = (id: string) => {
    const nextActive = closeTab(id);
    if (!nextActive) {
      navigate({ to: "/" });
      return;
    }
    const nextTab = tabs.find((candidate) => candidate.id === nextActive);
    if (nextTab) navigate({ to: routeForTab(nextTab) });
  };
  const handleBack = (tab: PageTab) => {
    if (tab.type !== "detail") return;
    const parent = backFromDetail(tab);
    if (!parent) {
      navigate({ to: "/" });
      return;
    }
    if (parent === "list") {
      navigate({ to: "/entity-types" });
      return;
    }
    navigate({ to: `/modules/${parent.slice(2)}` });
  };

  return (
    <div
      className={layoutStyles.layoutGrid}
      style={{ gridTemplateColumns: `${expanded ? 220 : 48}px minmax(0,1fr)` }}
    >
      <Sidebar
        expanded={expanded}
        onToggleExpanded={() => setExpanded((e) => !e)}
        items={NAVIGATION_ITEMS}
        currentNav={currentTab?.nav}
        onNavigate={handleNavigate}
      />
      <div className={layoutStyles.mainColumn}>
        <PageTabs
          tabs={tabs}
          active={active}
          navigation={NAVIGATION_ITEMS}
          onSelect={handleSelect}
          onBack={handleBack}
          onClose={handleClose}
        />
        {!currentTab && (
          <div className={layoutStyles.welcome}>
            <Text weight="semibold" size={400}>
              No open tabs
            </Text>
            <Button appearance="primary" onClick={() => handleNavigate("entities")}>
              Open Entity Types
            </Button>
          </div>
        )}
        {currentTab && <Outlet />}
      </div>
    </div>
  );
}
