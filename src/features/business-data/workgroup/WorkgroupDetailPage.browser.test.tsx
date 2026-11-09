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
import { WorkgroupDetailPage } from "./WorkgroupDetailPage";
import parity from "./WorkgroupDetailPage.parity.json";

const rootRoute = createRootRoute();
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-data/workgroup/$name",
  component: CompRoute,
});
const routeTree = rootRoute.addChildren([detailRoute]);
const ENTITY = "Production WG";

function CompRoute() {
  const { name } = detailRoute.useParams();
  return <WorkgroupDetailPage name={name} />;
}

async function renderDetail() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [
        "/business-data/workgroup/$name".replace("$name", encodeURIComponent(ENTITY)),
      ],
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
