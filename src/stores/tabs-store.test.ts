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

  it("opens a detail tab titled from the detail name mapping", () => {
    const store = useTabsStore.getState();
    store.openNav("entities");
    store.openDetail("AIAgent");
    const state = useTabsStore.getState();
    expect(state.tabs).toHaveLength(2);
    expect(state.active).toBe("d:AIAgent");
    expect(state.tabs[1]).toEqual({
      id: "d:AIAgent",
      type: "detail",
      nav: "entities",
      title: "CM MES Agent",
    });
  });

  it("returns to the list when a detail tab is closed", () => {
    const store = useTabsStore.getState();
    store.openNav("entities");
    store.openDetail("AIAgent");
    const nextActive = store.closeTab("d:AIAgent");
    expect(nextActive).toBe("list");
    expect(useTabsStore.getState().active).toBe("list");
  });

  it("opens the parent module when going back from a direct detail tab", () => {
    const store = useTabsStore.getState();
    store.syncRoute("/detail/AIAgent");
    const detail = useTabsStore.getState().tabs.find((tab) => tab.id === "d:AIAgent");
    expect(detail?.nav).toBe("ai");
    const parent = store.backFromDetail(detail!);
    expect(parent).toBe("p:ai");
    expect(useTabsStore.getState().active).toBe("p:ai");
  });

  it("syncs tabs from a module route", () => {
    useTabsStore.getState().syncRoute("/modules/tools");
    const state = useTabsStore.getState();
    expect(state.tabs.map((tab) => tab.id)).toEqual(["list", "p:tools"]);
    expect(state.active).toBe("p:tools");
  });

  it("ignores unknown routes and unknown navigation ids", () => {
    const store = useTabsStore.getState();
    store.syncRoute("/no-such-page");
    store.openNav("no-such-nav");
    expect(useTabsStore.getState().tabs).toEqual([]);
    expect(useTabsStore.getState().active).toBeNull();
  });
});
