import { beforeEach, describe, expect, it } from "vitest";
import { useTabsStore } from "@/stores/tabs-store";

describe("tabs store", () => {
  beforeEach(() => {
    useTabsStore.setState({ tabs: [], active: null });
  });

  it("opens the administration hub tab", () => {
    useTabsStore.getState().openRoute("/administration");
    const state = useTabsStore.getState();
    expect(state.tabs).toEqual([
      {
        id: "administration",
        route: "/administration",
        title: "Administration",
        parentRoute: null,
      },
    ]);
    expect(state.active).toBe("administration");
  });

  it("does not duplicate an already open tab", () => {
    const store = useTabsStore.getState();
    store.openRoute("/administration");
    store.openRoute("/administration");
    expect(useTabsStore.getState().tabs).toHaveLength(1);
  });

  it("clicking the same link twice keeps one tab", () => {
    const store = useTabsStore.getState();
    store.openRoute("/administration");
    store.openRoute("/administration/ai-agent");
    store.openRoute("/administration/ai-agent");
    const state = useTabsStore.getState();
    expect(state.tabs).toHaveLength(1);
    expect(state.active).toBe("administration/ai-agent");
  });

  it("clicking a different link navigates the current tab without adding one", () => {
    const store = useTabsStore.getState();
    store.openRoute("/administration");
    store.openRoute("/ai");
    const state = useTabsStore.getState();
    expect(state.tabs).toHaveLength(1);
    expect(state.tabs[0]).toEqual({
      id: "ai",
      route: "/ai",
      title: "AI",
      parentRoute: null,
    });
    expect(state.active).toBe("ai");
  });

  it("closing an active tab activates the previous tab", () => {
    const store = useTabsStore.getState();
    store.openRoute("/administration");
    store.addTab();
    store.openRoute("/administration/ai-agent/AnalyticsViewAgent");
    const nextActive = store.closeTab("administration/ai-agent/AnalyticsViewAgent");
    const state = useTabsStore.getState();
    expect(nextActive).toBe("administration");
    expect(state.active).toBe("administration");
    expect(state.tabs.map((tab) => tab.id)).toEqual(["administration"]);
  });

  it("closing the last remaining tab auto-opens a home tab", () => {
    const store = useTabsStore.getState();
    store.openRoute("/administration");
    const nextActive = store.closeTab("administration");
    const state = useTabsStore.getState();
    expect(nextActive).toBe("administration");
    expect(state.tabs).toEqual([
      {
        id: "administration",
        route: "/administration",
        title: "Administration",
        parentRoute: null,
      },
    ]);
    expect(state.active).toBe("administration");
  });

  it("closing a non-active tab leaves the active tab unchanged", () => {
    const store = useTabsStore.getState();
    store.openRoute("/administration");
    store.addTab();
    store.closeTab("administration");
    expect(useTabsStore.getState().tabs.map((tab) => tab.id)).toEqual(["administration:2"]);
    expect(useTabsStore.getState().active).toBe("administration:2");
  });

  it("the new tab button always adds a home tab even when one already exists", () => {
    const store = useTabsStore.getState();
    store.openRoute("/administration");
    const first = store.addTab();
    const second = store.addTab();
    const state = useTabsStore.getState();
    expect(first).toBe("administration:2");
    expect(second).toBe("administration:3");
    expect(state.tabs).toHaveLength(3);
    expect(state.tabs.every((tab) => tab.route === "/administration")).toBe(true);
    expect(state.active).toBe("administration:3");
  });

  it("going back from a detail activates a separately open parent tab and closes the detail", () => {
    const store = useTabsStore.getState();
    store.openRoute("/administration/ai-agent");
    store.addTab();
    store.syncRoute("/administration/ai-agent/AnalyticsViewAgent");
    const detail = useTabsStore
      .getState()
      .tabs.find((tab) => tab.id === "administration/ai-agent/AnalyticsViewAgent");
    expect(useTabsStore.getState().tabs.map((tab) => tab.id)).toEqual([
      "administration/ai-agent",
      "administration/ai-agent/AnalyticsViewAgent",
    ]);
    const parent = store.backFromTab(detail!);
    const state = useTabsStore.getState();
    expect(parent).toBe("administration/ai-agent");
    expect(state.active).toBe("administration/ai-agent");
    expect(state.tabs.map((tab) => tab.id)).toEqual(["administration/ai-agent"]);
  });

  it("going back navigates the current tab when the parent is not open separately", () => {
    const store = useTabsStore.getState();
    store.openRoute("/administration");
    store.openRoute("/administration/ai-agent/AnalyticsViewAgent");
    const detail = useTabsStore
      .getState()
      .tabs.find((tab) => tab.id === "administration/ai-agent/AnalyticsViewAgent");
    const parent = store.backFromTab(detail!);
    const state = useTabsStore.getState();
    expect(parent).toBe("administration/ai-agent");
    expect(state.active).toBe("administration/ai-agent");
    expect(state.tabs.map((tab) => tab.id)).toEqual(["administration/ai-agent"]);
  });

  it("going back from a list goes to the hub", () => {
    const store = useTabsStore.getState();
    store.openRoute("/administration/ai-agent");
    const list = useTabsStore.getState().tabs[0];
    const parent = store.backFromTab(list);
    const state = useTabsStore.getState();
    expect(parent).toBe("administration");
    expect(state.active).toBe("administration");
    expect(state.tabs.map((tab) => tab.id)).toEqual(["administration"]);
  });

  it("going back from the hub does nothing", () => {
    const store = useTabsStore.getState();
    store.openRoute("/administration");
    const hub = useTabsStore.getState().tabs[0];
    const parent = store.backFromTab(hub);
    const state = useTabsStore.getState();
    expect(parent).toBe("administration");
    expect(state.tabs.map((tab) => tab.id)).toEqual(["administration"]);
    expect(state.active).toBe("administration");
  });

  it("syncing a detail route from empty creates only that tab", () => {
    useTabsStore.getState().syncRoute("/administration/ai-agent/AnalyticsViewAgent");
    const state = useTabsStore.getState();
    expect(state.tabs.map((tab) => tab.id)).toEqual(["administration/ai-agent/AnalyticsViewAgent"]);
    expect(state.active).toBe("administration/ai-agent/AnalyticsViewAgent");
  });

  it("syncing an already open route activates it without adding a tab", () => {
    const store = useTabsStore.getState();
    store.openRoute("/administration");
    store.addTab();
    store.openRoute("/ai");
    store.syncRoute("/administration");
    const state = useTabsStore.getState();
    expect(state.tabs.map((tab) => tab.id)).toEqual(["administration", "ai"]);
    expect(state.active).toBe("administration");
  });

  it("ignores unknown routes", () => {
    const store = useTabsStore.getState();
    store.syncRoute("/no-such-page");
    store.openRoute("/no-such-page");
    expect(useTabsStore.getState().tabs).toEqual([]);
    expect(useTabsStore.getState().active).toBeNull();
    store.openRoute("/administration");
    store.openRoute("/no-such-page");
    expect(useTabsStore.getState().tabs.map((tab) => tab.id)).toEqual(["administration"]);
  });
});
