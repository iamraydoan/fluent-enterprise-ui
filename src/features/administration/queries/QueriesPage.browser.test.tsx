import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { expect, test } from "vitest";
import { pageFingerprint, renderWithAppTheme } from "@/test-utils";
import { QueriesPage } from "./QueriesPage";
import parity from "./QueriesPage.parity.json";

const rootRoute = createRootRoute();
const listRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/administration/queries",
  component: QueriesPage,
});
const routeTree = rootRoute.addChildren([listRoute]);

async function renderList() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/administration/queries"] }),
  });
  return await renderWithAppTheme(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

export async function pageViews() {
  const sectionButtons = Array.from(document.querySelectorAll<HTMLElement>("aside button")).filter(
    (button) => !button.getAttribute("aria-label"),
  );
  const tabButtons = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'));
  const buttons = sectionButtons.length > 0 ? sectionButtons : tabButtons;
  if (buttons.length === 0) {
    return { walk: "page", views: { page: pageFingerprint() } };
  }
  const views: Record<string, unknown> = {};
  for (const button of buttons) {
    button.click();
    await new Promise((resolve) => setTimeout(resolve, 300));
    const label = (button.textContent ?? "").trim() || "unknown";
    views[label] = pageFingerprint();
  }
  return { walk: sectionButtons.length > 0 ? "sections" : "tabs", views };
}

test("keeps every card, grid and field row in every section", async () => {
  await renderList();
  await expect.poll(() => document.body.innerText.includes("GetAllMaterials")).toBe(true);
  expect(await pageViews()).toEqual(parity);
});
