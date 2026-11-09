import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { expect, test } from "vitest";
import { capturePageViews, renderWithAppTheme } from "@/test-utils";
import { MyWorkgroupPage } from "./MyWorkgroupPage";
import parity from "./MyWorkgroupPage.parity.json";

const rootRoute = createRootRoute();
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-workgroup",
  component: CompRoute,
});
const routeTree = rootRoute.addChildren([detailRoute]);
const ENTITY = "My Workgroup";

function CompRoute() {
  return <MyWorkgroupPage />;
}

async function renderDetail() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: ["/my-workgroup".replace("$name", encodeURIComponent(ENTITY))],
    }),
  });
  return await renderWithAppTheme(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

test("keeps every card, grid and field row in every section", async () => {
  const screen = await renderDetail();
  await expect.element(screen.getByText(ENTITY).first()).toBeVisible();
  expect(await capturePageViews({ includeDefault: true, expected: parity })).toEqual(parity);
});
