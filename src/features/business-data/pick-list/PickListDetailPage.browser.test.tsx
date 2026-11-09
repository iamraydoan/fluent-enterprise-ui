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
import { PickListDetailPage } from "./PickListDetailPage";
import parity from "./PickListDetailPage.parity.json";

const rootRoute = createRootRoute();
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-data/pick-list/$name",
  component: PickListDetailPageRoute,
});
const routeTree = rootRoute.addChildren([detailRoute]);
const ENTITY = "PL-0001";

function PickListDetailPageRoute() {
  const { name } = detailRoute.useParams();
  return <PickListDetailPage name={name} />;
}

async function renderDetail() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [
        "/business-data/pick-list/$name".replace("$name", encodeURIComponent(ENTITY)),
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
  await expect
    .poll(() => document.querySelectorAll('[style*="grid-template-columns"]').length)
    .toBeGreaterThan(0);
  expect(await capturePageViews()).toEqual(parity);
});
