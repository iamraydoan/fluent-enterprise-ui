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

async function waitForAbsent(text: string) {
  const started = Date.now();
  while (Date.now() - started < 10000) {
    if (!document.body.innerText.includes(text)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  expect(document.body.innerText).not.toContain(text);
}

function toggleButton() {
  return document.querySelector(
    'button[aria-label="Collapse action bar"], button[aria-label="Expand action bar"]',
  );
}

function titleStripBorderTop() {
  const toggle = toggleButton();
  if (!toggle || !toggle.parentElement) throw new Error("PageHeader toggle not found");
  return window.getComputedStyle(toggle.parentElement).borderTopWidth;
}

async function waitForEditCount(count: number) {
  const started = Date.now();
  while (Date.now() - started < 10000) {
    const found = Array.from(document.querySelectorAll("button")).filter(
      (button) => button.textContent?.trim() === "Edit",
    ).length;
    if (found === count) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const found = Array.from(document.querySelectorAll("button")).filter(
    (button) => button.textContent?.trim() === "Edit",
  ).length;
  expect(found).toBe(count);
}

beforeEach(() => {
  useTabsStore.setState({ tabs: [], active: null });
});

test("entity types list header collapses and expands through the shared toggle", async () => {
  const screen = renderAt("/administration/entity-types");
  await waitForText("Entity Types (393)");
  await expect.element(screen.getByText("Entity Types (393)")).toBeVisible();
  expect(titleStripBorderTop()).toBe("1px");
  await screen.getByRole("button", { name: "Collapse action bar" }).click();
  await waitForAbsent("Download LBOs");
  await expect.element(screen.getByText("Entity Types (393)")).toBeVisible();
  expect(titleStripBorderTop()).toBe("0px");
  expect(useTabsStore.getState().tabs.length).toBe(1);
  await screen.getByRole("button", { name: "Expand action bar" }).click();
  await waitForText("Download LBOs");
  expect(titleStripBorderTop()).toBe("1px");
});

test("ai agent list header collapses and expands through the shared toggle", async () => {
  const screen = renderAt("/administration/ai-agent");
  await waitForText("AI Agents (5)");
  await expect.element(screen.getByText("AI Agents (5)")).toBeVisible();
  await screen.getByRole("button", { name: "Collapse action bar" }).click();
  await waitForAbsent("Create");
  await expect.element(screen.getByText("AI Agents (5)")).toBeVisible();
  await screen.getByRole("button", { name: "Expand action bar" }).click();
  await waitForText("Create");
});

test("mcp server list header collapses and expands through the shared toggle", async () => {
  const screen = renderAt("/administration/ai-mcp-server");
  await waitForText("AI MCP Servers (5)");
  await expect.element(screen.getByText("AI MCP Servers (5)")).toBeVisible();
  await screen.getByRole("button", { name: "Collapse action bar" }).click();
  await waitForAbsent("Create");
  await expect.element(screen.getByText("AI MCP Servers (5)")).toBeVisible();
  await screen.getByRole("button", { name: "Expand action bar" }).click();
  await waitForText("Create");
});

test("apps list header collapses and expands through the shared toggle", async () => {
  const screen = renderAt("/administration/apps");
  await waitForText("Apps (4)");
  await expect.element(screen.getByText("Apps (4)")).toBeVisible();
  await screen.getByRole("button", { name: "Collapse action bar" }).click();
  await waitForAbsent("Create");
  await expect.element(screen.getByText("Apps (4)")).toBeVisible();
  await screen.getByRole("button", { name: "Expand action bar" }).click();
  await waitForText("Create");
});

test("configuration list header collapses and expands through the shared toggle", async () => {
  const screen = renderAt("/administration/configuration");
  await waitForText("Configuration (4)");
  await expect.element(screen.getByText("Configuration (4)")).toBeVisible();
  await screen.getByRole("button", { name: "Collapse action bar" }).click();
  await waitForAbsent("Create");
  await expect.element(screen.getByText("Configuration (4)")).toBeVisible();
  await screen.getByRole("button", { name: "Expand action bar" }).click();
  await waitForText("Create");
});

test("ai agent detail header collapses and expands while the mini bar stays", async () => {
  const screen = renderAt("/administration/ai-agent");
  await waitForText("AI Agents (5)");
  await expect.element(screen.getByText("AI Agents (5)")).toBeVisible();
  await screen.getByText("CM MES Agent").click();
  await waitForText("LibreChat");
  await screen.getByRole("button", { name: "Instructions" }).click();
  await waitForEditCount(2);
  expect(titleStripBorderTop()).toBe("1px");
  await screen.getByRole("button", { name: "Collapse action bar" }).click();
  await waitForAbsent("Ask AI");
  await waitForEditCount(1);
  expect(document.body.innerText).toContain("CM MES Agent");
  expect(document.body.innerText).toContain("References");
  expect(titleStripBorderTop()).toBe("0px");
  await screen.getByRole("button", { name: "Expand action bar" }).click();
  await waitForText("Ask AI");
  await waitForEditCount(2);
  expect(titleStripBorderTop()).toBe("1px");
});

test("mcp server detail header collapses and expands while the mini bar stays", async () => {
  const screen = renderAt("/administration/ai-mcp-server");
  await waitForText("AI MCP Servers (5)");
  await expect.element(screen.getByText("AI MCP Servers (5)")).toBeVisible();
  await screen.getByRole("link", { name: "Cubes", exact: true }).click();
  await waitForText("http://mcp-cubejs:8080/mcp");
  await screen.getByRole("button", { name: "Tools" }).click();
  await waitForText("Tools (2)");
  await expect.element(screen.getByText("Synchronize")).toBeVisible();
  await screen.getByRole("button", { name: "Collapse action bar" }).click();
  await waitForAbsent("Ask AI");
  await expect.element(screen.getByText("Synchronize")).toBeVisible();
  expect(document.body.innerText).toContain("Cubes");
  expect(document.body.innerText).toContain("References");
  await screen.getByRole("button", { name: "Expand action bar" }).click();
  await waitForText("Ask AI");
});

test("collapse state is per page for lists", async () => {
  const screen = renderAt("/administration/ai-agent");
  await waitForText("AI Agents (5)");
  await expect.element(screen.getByText("AI Agents (5)")).toBeVisible();
  await screen.getByRole("button", { name: "Collapse action bar" }).click();
  await waitForAbsent("Create");
  await screen.getByRole("button", { name: "Administration", exact: true }).click();
  await waitForText("AI MCP Server");
  await screen.getByText("AI MCP Server").click();
  await waitForText("AI MCP Servers (5)");
  await expect.element(screen.getByText("Create")).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Collapse action bar" })).toBeVisible();
});

test("collapse state is per page for details", async () => {
  const screen = renderAt("/administration/ai-agent");
  await waitForText("AI Agents (5)");
  await expect.element(screen.getByText("AI Agents (5)")).toBeVisible();
  await screen.getByText("CM MES Agent").click();
  await waitForText("LibreChat");
  await screen.getByRole("button", { name: "Collapse action bar" }).click();
  await waitForAbsent("Ask AI");
  await screen.getByRole("button", { name: "Back" }).click();
  await waitForText("AI Agents (5)");
  await screen.getByRole("button", { name: "Back" }).click();
  await waitForText("AI MCP Server");
  await screen.getByText("AI MCP Server").click();
  await waitForText("AI MCP Servers (5)");
  await screen.getByRole("link", { name: "Cubes", exact: true }).click();
  await waitForText("http://mcp-cubejs:8080/mcp");
  await expect.element(screen.getByText("Ask AI")).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Collapse action bar" })).toBeVisible();
});

test("administration hub has no header collapse toggle", async () => {
  const screen = renderAt("/administration");
  await expect.element(screen.getByText("AI Agent")).toBeVisible();
  expect(toggleButton()).toBeNull();
});

test("ai chat has no header collapse toggle", async () => {
  renderAt("/ai");
  await waitForText("Acts as a general MES assistant");
  expect(toggleButton()).toBeNull();
});
