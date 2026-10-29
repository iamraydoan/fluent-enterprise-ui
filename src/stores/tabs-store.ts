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
  addTab: () => string;
  closeTab: (id: string) => string | null;
  backFromDetail: (tab: PageTab) => string | null;
  setActive: (id: string) => void;
  syncRoute: (pathname: string) => void;
}

function homeTab(id: string): PageTab {
  return { id, type: "list", nav: "entities", title: "Entity Types" };
}

function nextHomeId(tabs: PageTab[]): string {
  if (!tabs.some((tab) => tab.id === "list")) return "list";
  let suffix = 2;
  while (tabs.some((tab) => tab.id === `list:${suffix}`)) suffix += 1;
  return `list:${suffix}`;
}

function replaceActive(tabs: PageTab[], active: string | null, next: PageTab): PageTab[] {
  const index = tabs.findIndex((tab) => tab.id === active);
  if (index < 0) return [...tabs, next];
  const replaced = [...tabs];
  replaced[index] = next;
  return replaced;
}

function activateOrNavigate(
  tabs: PageTab[],
  active: string | null,
  next: PageTab,
): { tabs: PageTab[]; active: string } {
  const existing = tabs.find((tab) => tab.id === next.id);
  if (existing) return { tabs, active: existing.id };
  if (tabs.length === 0 || active === null) return { tabs: [next], active: next.id };
  return { tabs: replaceActive(tabs, active, next), active: next.id };
}

function listTarget(tabs: PageTab[], active: string | null): { tabs: PageTab[]; active: string } {
  const activeTab = tabs.find((tab) => tab.id === active);
  if (activeTab?.type === "list") return { tabs, active: activeTab.id };
  const existing = tabs.find((tab) => tab.type === "list");
  if (existing) return { tabs, active: existing.id };
  if (tabs.length === 0) return { tabs: [homeTab("list")], active: "list" };
  return { tabs: replaceActive(tabs, active, homeTab("list")), active: "list" };
}

export const useTabsStore = create<TabsState>()((set, get) => ({
  tabs: [],
  active: null,
  openNav: (navigationId) => {
    const navigationItem = getNavigationItem(navigationId);
    if (!navigationItem) return;
    const { tabs, active } = get();
    if (navigationId === "entities") {
      set(listTarget(tabs, active));
      return;
    }
    const next: PageTab = {
      id: `p:${navigationId}`,
      type: "page",
      nav: navigationId,
      title: navigationItem.label,
    };
    set(activateOrNavigate(tabs, active, next));
  },
  openDetail: (name) => {
    const { tabs, active } = get();
    const nav = tabs.find((tab) => tab.id === active)?.nav ?? "entities";
    const next: PageTab = {
      id: `d:${name}`,
      type: "detail",
      nav,
      title: DETAIL_TITLE_BY_NAME[name] ?? name,
    };
    set(activateOrNavigate(tabs, active, next));
  },
  addTab: () => {
    const { tabs } = get();
    const id = nextHomeId(tabs);
    set({ tabs: [...tabs, homeTab(id)], active: id });
    return id;
  },
  closeTab: (id) => {
    const { tabs, active } = get();
    const index = tabs.findIndex((tab) => tab.id === id);
    if (index < 0) return active;
    const next = tabs.filter((tab) => tab.id !== id);
    if (active !== id) {
      set({ tabs: next, active });
      return active;
    }
    if (next.length === 0) {
      set({ tabs: [homeTab("list")], active: "list" });
      return "list";
    }
    const nextActive = next[Math.max(0, index - 1)].id;
    set({ tabs: next, active: nextActive });
    return nextActive;
  },
  backFromDetail: (tab) => {
    if (tab.type !== "detail") return get().active;
    const { tabs } = get();
    if (tab.nav === "entities") {
      const existing = tabs.find((candidate) => candidate.type === "list");
      if (existing) {
        set({ tabs: tabs.filter((candidate) => candidate.id !== tab.id), active: existing.id });
        return existing.id;
      }
      const replaced = replaceActive(tabs, tab.id, homeTab("list"));
      set({ tabs: replaced, active: "list" });
      return "list";
    }
    const parent = `p:${tab.nav}`;
    const existing = tabs.find((candidate) => candidate.id === parent);
    if (existing) {
      set({ tabs: tabs.filter((candidate) => candidate.id !== tab.id), active: parent });
      return parent;
    }
    const navigationItem = getNavigationItem(tab.nav);
    if (!navigationItem) {
      const existingList = tabs.find((candidate) => candidate.type === "list");
      if (existingList) {
        set({ tabs: tabs.filter((candidate) => candidate.id !== tab.id), active: existingList.id });
        return existingList.id;
      }
      set({ tabs: replaceActive(tabs, tab.id, homeTab("list")), active: "list" });
      return "list";
    }
    const next: PageTab = {
      id: parent,
      type: "page",
      nav: tab.nav,
      title: navigationItem.label,
    };
    set({ tabs: replaceActive(tabs, tab.id, next), active: parent });
    return parent;
  },
  setActive: (id) => {
    set({ active: id });
  },
  syncRoute: (pathname) => {
    const parsed = tabFromPath(pathname);
    if (parsed.kind === "none") return;
    const { tabs, active } = get();
    if (parsed.kind === "list") {
      set(listTarget(tabs, active));
      return;
    }
    if (parsed.kind === "page") {
      const navigationItem = getNavigationItem(parsed.nav);
      if (!navigationItem) return;
      const next: PageTab = {
        id: `p:${parsed.nav}`,
        type: "page",
        nav: parsed.nav,
        title: navigationItem.label,
      };
      set(activateOrNavigate(tabs, active, next));
      return;
    }
    const next: PageTab = {
      id: `d:${parsed.name}`,
      type: "detail",
      nav: parsed.name === "AIAgent" ? "ai" : "entities",
      title: DETAIL_TITLE_BY_NAME[parsed.name] ?? parsed.name,
    };
    set(activateOrNavigate(tabs, active, next));
  },
}));
