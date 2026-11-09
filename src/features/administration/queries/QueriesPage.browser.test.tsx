import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { expect, test } from "vitest";
import { captureWalkViews, renderWithAppTheme } from "@/test-utils";
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

function folderButtonCount() {
  return Array.from(document.querySelectorAll("aside button")).filter(
    (button) => !button.getAttribute("aria-label"),
  ).length;
}

test("keeps every card, grid and field row in every section", async () => {
  await renderList();
  await expect.poll(() => document.body.innerText.includes("GetAllMaterials")).toBe(true);
  await expect.poll(folderButtonCount).toBe(3);
  expect(await captureWalkViews(parity)).toEqual(parity);
});
