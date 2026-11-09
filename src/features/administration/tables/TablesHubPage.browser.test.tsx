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
import { TablesHubPage } from "./TablesHubPage";
import parity from "./TablesHubPage.parity.json";

const rootRoute = createRootRoute();
const hubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/administration/tables",
  component: TablesHubPage,
});
const routeTree = rootRoute.addChildren([hubRoute]);

async function renderHub() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/administration/tables"] }),
  });
  return await renderWithAppTheme(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

test("keeps every card, grid and field row in every section", async () => {
  await renderHub();
  await expect.poll(() => document.body.innerText.includes("AQLAcceptanceQualityLimit")).toBe(true);
  expect(await captureWalkViews(parity)).toEqual(parity);
});
