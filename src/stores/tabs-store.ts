import { create } from "zustand";
import { tabForRoute } from "@/data/navigation";

export interface PageTab {
  id: string;
  route: string;
  title: string;
  parentRoute: string | null;
}

interface TabsState {
  tabs: PageTab[];
  active: string | null;
  openRoute: (route: string) => void;
  addTab: () => string;
  closeTab: (id: string) => string | null;
  backFromTab: (tab: PageTab) => string | null;
  setActive: (id: string) => void;
  syncRoute: (pathname: string) => void;
}

function homeTab(id: string): PageTab {
  return { id, route: "/administration", title: "Administration", parentRoute: null };
}

function nextHomeId(tabs: PageTab[]): string {
  if (!tabs.some((tab) => tab.id === "administration")) return "administration";
  let suffix = 2;
  while (tabs.some((tab) => tab.id === `administration:${suffix}`)) suffix += 1;
  return `administration:${suffix}`;
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

export const useTabsStore = create<TabsState>()((set, get) => ({
  tabs: [],
  active: null,
  openRoute: (route) => {
    const next = tabForRoute(route);
    if (!next) return;
    const { tabs, active } = get();
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
      set({ tabs: [homeTab("administration")], active: "administration" });
      return "administration";
    }
    const nextActive = next[Math.max(0, index - 1)].id;
    set({ tabs: next, active: nextActive });
    return nextActive;
  },
  backFromTab: (tab) => {
    if (!tab.parentRoute) return get().active;
    const parent = tabForRoute(tab.parentRoute);
    if (!parent) return get().active;
    const { tabs } = get();
    const existing = tabs.find((candidate) => candidate.route === parent.route);
    if (existing) {
      set({ tabs: tabs.filter((candidate) => candidate.id !== tab.id), active: existing.id });
      return existing.id;
    }
    set({ tabs: replaceActive(tabs, tab.id, parent), active: parent.id });
    return parent.id;
  },
  setActive: (id) => {
    set({ active: id });
  },
  syncRoute: (pathname) => {
    const next = tabForRoute(pathname);
    if (!next) return;
    const { tabs, active } = get();
    set(activateOrNavigate(tabs, active, next));
  },
}));
