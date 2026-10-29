import { beforeEach, describe, expect, it } from "vitest";
import { useTabsStore } from "@/stores/tabs-store";

describe("tabs store", () => {
  beforeEach(() => {
    useTabsStore.setState({ tabs: [], active: null });
  });

  it("opens the entity types list tab", () => {
    useTabsStore.getState().openNav("entities");
    const state = useTabsStore.getState();
    expect(state.tabs).toEqual([
      { id: "list", type: "list", nav: "entities", title: "Entity Types" },
    ]);
    expect(state.active).toBe("list");
  });

  it("does not duplicate an already open tab", () => {
    const store = useTabsStore.getState();
    store.openNav("entities");
    store.openNav("entities");
    expect(useTabsStore.getState().tabs).toHaveLength(1);
  });

  it("clicking the same link twice keeps one tab", () => {
    const store = useTabsStore.getState();
    store.openNav("entities");
    store.openDetail("AIAgent");
    store.openDetail("AIAgent");
    const state = useTabsStore.getState();
    expect(state.tabs).toHaveLength(1);
    expect(state.active).toBe("d:AIAgent");
  });

  it("clicking a different link navigates the current tab without adding one", () => {
    const store = useTabsStore.getState();
    store.openNav("entities");
    store.openNav("tools");
    const state = useTabsStore.getState();
    expect(state.tabs).toHaveLength(1);
    expect(state.tabs[0]).toEqual({
      id: "p:tools",
      type: "page",
      nav: "tools",
      title: "Tools",
    });
    expect(state.active).toBe("p:tools");
  });

  it("opening a detail navigates the current tab and titles it from the detail name mapping", () => {
    const store = useTabsStore.getState();
    store.openNav("entities");
    store.openDetail("AIAgent");
    const state = useTabsStore.getState();
    expect(state.tabs).toHaveLength(1);
    expect(state.active).toBe("d:AIAgent");
    expect(state.tabs[0]).toEqual({
      id: "d:AIAgent",
      type: "detail",
      nav: "entities",
      title: "CM MES Agent",
    });
  });

  it("closing a detail tab activates the previous tab", () => {
    const store = useTabsStore.getState();
    store.openNav("entities");
    store.addTab();
    store.openNav("tools");
    store.addTab();
    store.openDetail("AIAgent");
    const nextActive = store.closeTab("d:AIAgent");
    const state = useTabsStore.getState();
    expect(nextActive).toBe("p:tools");
    expect(state.active).toBe("p:tools");
    expect(state.tabs.map((tab) => tab.id)).toEqual(["list", "p:tools"]);
  });

  it("closing the last remaining tab auto-opens a home tab", () => {
    const store = useTabsStore.getState();
    store.openNav("entities");
    const nextActive = store.closeTab("list");
    const state = useTabsStore.getState();
    expect(nextActive).toBe("list");
    expect(state.tabs).toEqual([
      { id: "list", type: "list", nav: "entities", title: "Entity Types" },
    ]);
    expect(state.active).toBe("list");
  });

  it("closing a non-active tab leaves the active tab unchanged", () => {
    const store = useTabsStore.getState();
    store.openNav("entities");
    store.addTab();
    store.closeTab("list");
    const state = useTabsStore.getState();
    expect(state.tabs.map((tab) => tab.id)).toEqual(["list:2"]);
    expect(state.active).toBe("list:2");
  });

  it("the new tab button always adds a home tab even when one already exists", () => {
    const store = useTabsStore.getState();
    store.openNav("entities");
    const first = store.addTab();
    const second = store.addTab();
    const state = useTabsStore.getState();
    expect(first).toBe("list:2");
    expect(second).toBe("list:3");
    expect(state.tabs).toHaveLength(3);
    expect(state.tabs.every((tab) => tab.type === "list")).toBe(true);
    expect(state.active).toBe("list:3");
  });

  it("going back activates a separately open parent tab and closes the detail", () => {
    const store = useTabsStore.getState();
    store.openNav("ai");
    store.addTab();
    store.syncRoute("/detail/AIAgent");
    const detail = useTabsStore.getState().tabs.find((tab) => tab.id === "d:AIAgent");
    expect(useTabsStore.getState().tabs.map((tab) => tab.id)).toEqual(["p:ai", "d:AIAgent"]);
    const parent = store.backFromDetail(detail!);
    const state = useTabsStore.getState();
    expect(parent).toBe("p:ai");
    expect(state.active).toBe("p:ai");
    expect(state.tabs.map((tab) => tab.id)).toEqual(["p:ai"]);
  });

  it("going back navigates the current tab when the parent is not open separately", () => {
    const store = useTabsStore.getState();
    store.openNav("entities");
    store.openDetail("AIAgent");
    const detail = useTabsStore.getState().tabs.find((tab) => tab.id === "d:AIAgent");
    const parent = store.backFromDetail(detail!);
    const state = useTabsStore.getState();
    expect(parent).toBe("list");
    expect(state.active).toBe("list");
    expect(state.tabs.map((tab) => tab.id)).toEqual(["list"]);
  });

  it("going back from a direct detail tab navigates to the parent module", () => {
    const store = useTabsStore.getState();
    store.syncRoute("/detail/AIAgent");
    const detail = useTabsStore.getState().tabs.find((tab) => tab.id === "d:AIAgent");
    expect(detail?.nav).toBe("ai");
    const parent = store.backFromDetail(detail!);
    const state = useTabsStore.getState();
    expect(parent).toBe("p:ai");
    expect(state.active).toBe("p:ai");
    expect(state.tabs.map((tab) => tab.id)).toEqual(["p:ai"]);
  });

  it("syncing a module route from empty creates only that tab", () => {
    useTabsStore.getState().syncRoute("/modules/tools");
    const state = useTabsStore.getState();
    expect(state.tabs.map((tab) => tab.id)).toEqual(["p:tools"]);
    expect(state.active).toBe("p:tools");
  });

  it("syncing an already open route activates it without adding a tab", () => {
    const store = useTabsStore.getState();
    store.openNav("entities");
    store.addTab();
    store.openNav("tools");
    store.syncRoute("/entity-types");
    const state = useTabsStore.getState();
    expect(state.tabs.map((tab) => tab.id)).toEqual(["list", "p:tools"]);
    expect(state.active).toBe("list");
  });

  it("ignores unknown routes and unknown navigation ids", () => {
    const store = useTabsStore.getState();
    store.syncRoute("/no-such-page");
    store.openNav("no-such-nav");
    expect(useTabsStore.getState().tabs).toEqual([]);
    expect(useTabsStore.getState().active).toBeNull();
    store.openNav("entities");
    store.openNav("no-such-nav");
    expect(useTabsStore.getState().tabs.map((tab) => tab.id)).toEqual(["list"]);
  });
});
