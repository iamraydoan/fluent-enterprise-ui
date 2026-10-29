import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { beforeEach, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { routeTree } from "@/routeTree.gen";
import { useTabsStore } from "@/stores/tabs-store";

function renderAt(path: string) {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

async function waitForText(text: string) {
  const started = Date.now();
  while (Date.now() - started < 10000) {
    if (document.body.innerText.includes(text)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  expect(document.body.innerText).toContain(text);
}

function tabCount() {
  return useTabsStore.getState().tabs.length;
}

beforeEach(() => {
  useTabsStore.setState({ tabs: [], active: null });
});

test("administration hub renders tiles and a tile opens its list without adding a tab", async () => {
  const screen = renderAt("/administration");
  await expect.element(screen.getByText("AI Agent")).toBeVisible();
  await screen.getByText("AI Agent").click();
  await waitForText("AI Agent (4)");
  await expect.element(screen.getByText("AI Agent (4)")).toBeVisible();
  expect(tabCount()).toBe(1);
});

test("sidebar navigation opens the AI chat without adding a tab", async () => {
  const screen = renderAt("/administration/ai-agent");
  await expect.element(screen.getByText("AI Agent (4)")).toBeVisible();
  await screen.getByRole("button", { name: "AI", exact: true }).click();
  await waitForText("Acts as a general MES assistant");
  expect(tabCount()).toBe(1);
});

test("the new tab button adds a home tab on every click", async () => {
  const screen = renderAt("/administration");
  await expect.element(screen.getByText("AI Agent")).toBeVisible();
  expect(tabCount()).toBe(1);
  await screen.getByRole("button", { name: "New tab" }).click();
  expect(tabCount()).toBe(2);
  await screen.getByRole("button", { name: "New tab" }).click();
  expect(tabCount()).toBe(3);
  expect(useTabsStore.getState().active).toBe("administration:3");
});

test("an AI Agent list link opens the detail in the current tab and back returns to the list", async () => {
  const screen = renderAt("/administration/ai-agent");
  await expect.element(screen.getByText("AI Agent (4)")).toBeVisible();
  await screen.getByText("CM MES Agent").click();
  await waitForText("LibreChat");
  await expect.element(screen.getByText("LibreChat")).toBeVisible();
  expect(tabCount()).toBe(1);
  await screen.getByRole("button", { name: "Back" }).click();
  await waitForText("AI Agent (4)");
  await expect.element(screen.getByText("AI Agent (4)")).toBeVisible();
  expect(tabCount()).toBe(1);
});

test("an MCP Server list link opens the Cubes detail and back returns to the list", async () => {
  const screen = renderAt("/administration/ai-mcp-server");
  await expect.element(screen.getByText("AI MCP Server (3)")).toBeVisible();
  await screen.getByText("Cubes").click();
  await waitForText("http://mcp-cube:8080/mcp");
  await expect.element(screen.getByText("http://mcp-cube:8080/mcp")).toBeVisible();
  expect(tabCount()).toBe(1);
  await screen.getByRole("button", { name: "Back" }).click();
  await waitForText("AI MCP Server (3)");
  await expect.element(screen.getByText("AI MCP Server (3)")).toBeVisible();
  expect(tabCount()).toBe(1);
});

test("an Entity Types list row click does nothing", async () => {
  const screen = renderAt("/administration/entity-types");
  await expect.element(screen.getByText("Entity Types (393)")).toBeVisible();
  await screen.getByText("AIAgent", { exact: true }).click();
  await new Promise((resolve) => setTimeout(resolve, 500));
  await expect.element(screen.getByText("Entity Types (393)")).toBeVisible();
  expect(tabCount()).toBe(1);
});

test("state filter still works without adding tabs", async () => {
  const screen = renderAt("/administration/entity-types");
  await expect.element(screen.getByText("Entity Types (393)")).toBeVisible();
  await screen.getByRole("button", { name: "STATE: ALL" }).click();
  await expect.element(screen.getByRole("menuitemradio", { name: "Active" })).toBeVisible();
  await new Promise((resolve) => setTimeout(resolve, 800));
  await screen.getByRole("menuitemradio", { name: "Active" }).click();
  await waitForText("STATE: ACTIVE");
  expect(tabCount()).toBe(1);
});

test("pagination still works without adding tabs", async () => {
  const screen = renderAt("/administration/entity-types");
  await expect.element(screen.getByText("Entity Types (393)")).toBeVisible();
  await screen.getByRole("button", { name: "Next page" }).click();
  await waitForText("Page 2 of 16");
  await screen.getByRole("button", { name: "Previous page" }).click();
  await waitForText("Page 1 of 16");
  expect(tabCount()).toBe(1);
});
