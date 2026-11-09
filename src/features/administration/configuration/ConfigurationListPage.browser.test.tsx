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
import { ConfigurationListPage } from "./ConfigurationListPage";
import parity from "./ConfigurationListPage.parity.json";

const rootRoute = createRootRoute();
const listRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/administration/configuration",
  component: ConfigurationListPage,
});
const routeTree = rootRoute.addChildren([listRoute]);

async function renderList() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/administration/configuration"] }),
  });
  return await renderWithAppTheme(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

test("keeps every card, grid and field row in every section", async () => {
  await renderList();
  await expect.poll(() => document.body.innerText.includes("MasterDataLoadDate")).toBe(true);
  expect(await captureWalkViews()).toEqual(parity);
});
