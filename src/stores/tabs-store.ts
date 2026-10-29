import { create } from "zustand";
import { DETAIL_TITLE_BY_NAME, getNavigationItem, tabFromPath } from "@/data/navigation";

export interface PageTab {
  id: string;
  type: "list" | "page" | "detail";
  nav: string;
  title: string;
}

interface TabsState {
  tabs: PageTab[];
  active: string | null;
  openNav: (navigationId: string) => void;
  openDetail: (name: string) => void;
  closeTab: (id: string) => string | null;
  backFromDetail: (tab: PageTab) => string | null;
  setActive: (id: string) => void;
  syncRoute: (pathname: string) => void;
}

function ensureListTab(tabs: PageTab[]) {
  return tabs.some((tab) => tab.id === "list")
    ? tabs
    : [...tabs, { id: "list", type: "list" as const, nav: "entities", title: "Entity Types" }];
}

export const useTabsStore = create<TabsState>()((set, get) => ({
  tabs: [],
  active: null,
  openNav: (navigationId) => {
    const navigationItem = getNavigationItem(navigationId);
    if (!navigationItem) return;
    const id = navigationId === "entities" ? "list" : `p:${navigationId}`;
    const type = navigationId === "entities" ? "list" : "page";
    set((state) => ({
      tabs: state.tabs.some((tab) => tab.id === id)
        ? state.tabs
        : [...state.tabs, { id, type, nav: navigationId, title: navigationItem.label }],
      active: id,
    }));
  },
  openDetail: (name) => {
    const { tabs, active } = get();
    const nav = tabs.find((tab) => tab.id === active)?.nav ?? "entities";
    const id = `d:${name}`;
    set((state) => ({
      tabs: state.tabs.some((tab) => tab.id === id)
        ? state.tabs
        : [...state.tabs, { id, type: "detail", nav, title: DETAIL_TITLE_BY_NAME[name] ?? name }],
      active: id,
    }));
  },
  closeTab: (id) => {
    const { tabs, active } = get();
    const index = tabs.findIndex((tab) => tab.id === id);
    const next = tabs.filter((tab) => tab.id !== id);
    const nextActive =
      active === id ? (next.length ? next[Math.max(0, index - 1)].id : null) : active;
    set({ tabs: next, active: nextActive });
    return nextActive;
  },
  backFromDetail: (tab) => {
    if (tab.type !== "detail") return get().active;
    const parent = tab.nav === "entities" ? "list" : `p:${tab.nav}`;
    const { tabs } = get();
    const next = tabs.filter((candidate) => candidate.id !== tab.id);
    if (parent === "list") {
      set({ tabs: ensureListTab(next), active: "list" });
      return "list";
    }
    const navigationItem = getNavigationItem(tab.nav);
    if (!navigationItem) {
      set({ tabs: next, active: next.length ? next[next.length - 1].id : null });
      return get().active;
    }
    const withParent = next.some((candidate) => candidate.id === parent)
      ? next
      : [...next, { id: parent, type: "page" as const, nav: tab.nav, title: navigationItem.label }];
    set({ tabs: withParent, active: parent });
    return parent;
  },
  setActive: (id) => {
    set({ active: id });
  },
  syncRoute: (pathname) => {
    const parsed = tabFromPath(pathname);
    if (parsed.kind === "none") return;
    if (parsed.kind === "list") {
      const { tabs, active } = get();
      if (active === "list" && tabs.some((tab) => tab.id === "list")) return;
      set({ tabs: ensureListTab(tabs), active: "list" });
      return;
    }
    if (parsed.kind === "page") {
      const navigationItem = getNavigationItem(parsed.nav);
      if (!navigationItem) return;
      const id = `p:${parsed.nav}`;
      const { tabs, active } = get();
      if (active === id && tabs.some((tab) => tab.id === id)) return;
      const withList = ensureListTab(tabs);
      const withPage = withList.some((tab) => tab.id === id)
        ? withList
        : [
            ...withList,
            { id, type: "page" as const, nav: parsed.nav, title: navigationItem.label },
          ];
      set({ tabs: withPage, active: id });
      return;
    }
    const id = `d:${parsed.name}`;
    const { tabs, active } = get();
    if (active === id && tabs.some((tab) => tab.id === id)) return;
    const withList = ensureListTab(tabs);
    const withDetail = withList.some((tab) => tab.id === id)
      ? withList
      : [
          ...withList,
          {
            id,
            type: "detail" as const,
            nav: parsed.name === "AIAgent" ? "ai" : "entities",
            title: DETAIL_TITLE_BY_NAME[parsed.name] ?? parsed.name,
          },
        ];
    set({ tabs: withDetail, active: id });
  },
}));
