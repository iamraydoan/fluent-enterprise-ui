import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { beforeEach, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { initI18n } from "@/i18n";
import { routeTree } from "@/routeTree.gen";
import { useTabsStore } from "@/stores/tabs-store";

function renderAt(path: string) {
  localStorage.setItem("fluent-enterprise-ui:language", "en");
  initI18n();
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

function clickButtonByText(text: string) {
  const button = Array.from(document.querySelectorAll("button")).find(
    (candidate) => candidate.textContent?.trim() === text,
  );
  if (!button) throw new Error(`Button not found: ${text}`);
  button.click();
}

beforeEach(() => {
  useTabsStore.setState({ tabs: [], active: null });
});

test("administration hub renders tiles and a tile opens its list without adding a tab", async () => {
  const screen = renderAt("/administration");
  await expect.element(screen.getByText("AI Agent")).toBeVisible();
  await screen.getByText("AI Agent").click();
  await waitForText("AI Agents (5)");
  await expect.element(screen.getByText("AI Agents (5)")).toBeVisible();
  expect(tabCount()).toBe(1);
});

test("sidebar navigation opens the AI chat without adding a tab", async () => {
  const screen = renderAt("/administration/ai-agent");
  await waitForText("AI Agents (5)");
  await expect.element(screen.getByText("AI Agents (5)")).toBeVisible();
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
  await waitForText("AI Agents (5)");
  await expect.element(screen.getByText("AI Agents (5)")).toBeVisible();
  await screen.getByText("CM MES Agent").click();
  await waitForText("LibreChat");
  await expect.element(screen.getByText("LibreChat")).toBeVisible();
  expect(tabCount()).toBe(1);
  await screen.getByRole("button", { name: "Back" }).click();
  await waitForText("AI Agents (5)");
  await expect.element(screen.getByText("AI Agents (5)")).toBeVisible();
  expect(tabCount()).toBe(1);
});

test("an MCP Server list link opens the Cubes detail and back returns to the list", async () => {
  const screen = renderAt("/administration/ai-mcp-server");
  await waitForText("AI MCP Servers (5)");
  await expect.element(screen.getByText("AI MCP Servers (5)")).toBeVisible();
  await screen.getByRole("link", { name: "Cubes", exact: true }).click();
  await waitForText("http://mcp-cubejs:8080/mcp");
  await expect.element(screen.getByText("http://mcp-cubejs:8080/mcp")).toBeVisible();
  expect(tabCount()).toBe(1);
  await screen.getByRole("button", { name: "Back" }).click();
  await waitForText("AI MCP Servers (5)");
  await expect.element(screen.getByText("AI MCP Servers (5)")).toBeVisible();
  expect(tabCount()).toBe(1);
});

test("an Entity Types list row click does nothing", async () => {
  const screen = renderAt("/administration/entity-types");
  await waitForText("Entity Types (393)");
  await expect.element(screen.getByText("Entity Types (393)")).toBeVisible();
  await screen.getByText("AIAgent", { exact: true }).click();
  await new Promise((resolve) => setTimeout(resolve, 500));
  await expect.element(screen.getByText("Entity Types (393)")).toBeVisible();
  expect(tabCount()).toBe(1);
});

test("state filter still works without adding tabs", async () => {
  const screen = renderAt("/administration/entity-types");
  await waitForText("Entity Types (393)");
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
  await waitForText("Entity Types (393)");
  await expect.element(screen.getByText("Entity Types (393)")).toBeVisible();
  await screen.getByRole("button", { name: "Next page" }).click();
  await waitForText("Page 2 of 16");
  await screen.getByRole("button", { name: "Previous page" }).click();
  await waitForText("Page 1 of 16");
  expect(tabCount()).toBe(1);
});

test("hub tiles open the Apps and Configuration lists and a placeholder tile shows the placeholder text", async () => {
  const screen = renderAt("/administration");
  await expect.element(screen.getByText("Apps")).toBeVisible();
  await screen.getByText("Apps").click();
  await waitForText("Apps (4)");
  await expect.element(screen.getByText("Shop Floor")).toBeVisible();
  expect(tabCount()).toBe(1);
  await screen.getByRole("button", { name: "Back" }).click();
  await waitForText("Configuration");
  await screen.getByText("Configuration").click();
  await waitForText("Configuration (4)");
  await expect.element(screen.getByText("Default language")).toBeVisible();
  await screen.getByRole("button", { name: "Back" }).click();
  await waitForText("Augmented Reality");
  await screen.getByText("Augmented Reality").click();
  await waitForText("This page is a placeholder in the demo.");
  expect(tabCount()).toBe(1);
});

test("search filters the AI Agents list", async () => {
  const screen = renderAt("/administration/ai-agent");
  await waitForText("AI Agents (5)");
  await expect.element(screen.getByText("AI Agents (5)")).toBeVisible();
  await screen.getByRole("textbox", { name: "Search" }).fill("Quality");
  await waitForText("AI Agents (1)");
  await expect.element(screen.getByText("Quality Assistant")).toBeVisible();
  expect(tabCount()).toBe(1);
});

test("chat send appends a demo reply with tool chips and new chat resets", async () => {
  const screen = renderAt("/ai");
  await waitForText("Acts as a general MES assistant");
  await screen.getByRole("textbox", { name: "Message MES Agent" }).fill("Hello demo");
  await screen.getByRole("button", { name: "Send" }).click();
  await waitForText("get_object_by_name");
  await expect.element(screen.getByText("Hello demo", { exact: true })).toBeVisible();
  await screen.getByRole("button", { name: "New chat" }).click();
  await waitForText("Summarize the latest attachment");
  expect(tabCount()).toBe(1);
});

test("agent detail dialogs open for instructions, MCP servers and tool descriptions", async () => {
  const screen = renderAt("/administration/ai-agent");
  await waitForText("AI Agents (5)");
  await expect.element(screen.getByText("AI Agents (5)")).toBeVisible();
  await screen.getByText("CM MES Agent").click();
  await waitForText("LibreChat");
  await screen.getByRole("button", { name: "Edit" }).click();
  await waitForText("Edit AI Agent Instructions");
  clickButtonByText("Cancel");
  await screen.getByText("MCP Servers").click();
  await waitForText("MCP Server Tools (15)");
  const editButtons = Array.from(document.querySelectorAll("button")).filter(
    (button) => button.textContent?.trim() === "Edit",
  );
  editButtons[0].click();
  await waitForText("Manage MCP Servers");
  await waitForText("Selected Tools (15)");
  clickButtonByText("Cancel");
  await screen
    .getByRole("button", { name: "View description of get_attachment_to_summarize" })
    .click();
  await waitForText("View Tool Description");
  expect(tabCount()).toBe(1);
});

test("MCP detail shows tools and synchronizes", async () => {
  const screen = renderAt("/administration/ai-mcp-server");
  await waitForText("AI MCP Servers (5)");
  await expect.element(screen.getByText("AI MCP Servers (5)")).toBeVisible();
  await screen.getByRole("link", { name: "Cubes", exact: true }).click();
  await waitForText("http://mcp-cubejs:8080/mcp");
  await screen.getByText("Tools").click();
  await waitForText("Tools (2)");
  await expect.element(screen.getByText("get_cube_schemas")).toBeVisible();
  expect(tabCount()).toBe(1);
});
