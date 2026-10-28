import { useState } from "react";
import { Button, makeStyles, Text, tokens } from "@/components/ui";
import { NAVIGATION_ITEMS } from "@/data/navigation";
import { DetailPage } from "@/features/detail/DetailPage";
import { EntityTypesPage } from "@/features/entity-types/EntityTypesPage";
import { ModulePage } from "@/features/modules/ModulePage";
import { PageTabs } from "@/layouts/PageTabs";
import type { PageTab } from "@/layouts/PageTabs";
import { Sidebar } from "@/layouts/Sidebar";

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

const DETAIL_TITLE_BY_NAME: Record<string, string> = { AIAgent: "CM MES Agent" };
const getNavigationItem = (navigationId: string) =>
  NAVIGATION_ITEMS.find((item) => item.id === navigationId);

export function MainLayout() {
  const layoutStyles = useStyles();
  const [expanded, setExpanded] = useState(false);
  const direct = typeof window !== "undefined" && window.location.hash === "#cm-mes-agent";
  const [tabs, setTabs] = useState<PageTab[]>(
    direct
      ? [
          { id: "list", type: "list", nav: "entities", title: "Entity Types" },
          { id: "d:CM MES Agent", type: "detail", nav: "ai", title: "CM MES Agent" },
        ]
      : [{ id: "list", type: "list", nav: "entities", title: "Entity Types" }],
  );
  const [active, setActive] = useState<string | null>(direct ? "d:CM MES Agent" : "list");

  const openNav = (navigationId: string) => {
    const navigationItem = getNavigationItem(navigationId);
    if (!navigationItem) return;
    const id = navigationId === "entities" ? "list" : "p:" + navigationId;
    setTabs((p) =>
      p.some((t) => t.id === id)
        ? p
        : [
            ...p,
            {
              id,
              type: navigationId === "entities" ? "list" : "page",
              nav: navigationId,
              title: navigationItem.label,
            },
          ],
    );
    setActive(id);
  };
  const openDetail = (name: string) => {
    const nav = tabs.find((tab) => tab.id === active)?.nav ?? "entities";
    const id = "d:" + name;
    setTabs((p) =>
      p.some((t) => t.id === id)
        ? p
        : [...p, { id, type: "detail", nav, title: DETAIL_TITLE_BY_NAME[name] ?? name }],
    );
    setActive(id);
  };
  const close = (id: string) => {
    const i = tabs.findIndex((t) => t.id === id);
    const next = tabs.filter((t) => t.id !== id);
    setTabs(next);
    if (active === id) setActive(next.length ? next[Math.max(0, i - 1)].id : null);
  };
  const back = (t: PageTab) => {
    if (t.type !== "detail") return;
    const parent = t.nav === "entities" ? "list" : "p:" + t.nav;
    close(t.id);
    openNav(t.nav);
    setActive(parent);
  };
  const currentTab = tabs.find((t) => t.id === active);

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
        onNavigate={openNav}
      />
      <div className={layoutStyles.mainColumn}>
        <PageTabs
          tabs={tabs}
          active={active}
          navigation={NAVIGATION_ITEMS}
          onSelect={setActive}
          onBack={back}
          onClose={close}
        />
        {!currentTab && (
          <div className={layoutStyles.welcome}>
            <Text weight="semibold" size={400}>
              No open tabs
            </Text>
            <Button appearance="primary" onClick={() => openNav("entities")}>
              Open Entity Types
            </Button>
          </div>
        )}
        {currentTab?.type === "list" && <EntityTypesPage onOpen={openDetail} />}
        {currentTab?.type === "page" && (
          <ModulePage key={currentTab.id} id={currentTab.nav} onOpen={openDetail} />
        )}
        {currentTab?.type === "detail" && (
          <DetailPage key={currentTab.id} title={currentTab.title} />
        )}
      </div>
    </div>
  );
}
