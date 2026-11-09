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
import { MaintenanceActivityOrderDetailPage } from "./MaintenanceActivityOrderDetailPage";
import parity from "./MaintenanceActivityOrderDetailPage.parity.json";

const rootRoute = createRootRoute();
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-data/maintenance-activity-order/$name",
  component: MaintenanceActivityOrderDetailPageRoute,
});
const routeTree = rootRoute.addChildren([detailRoute]);
const ENTITY = "14";

function MaintenanceActivityOrderDetailPageRoute() {
  const { name } = detailRoute.useParams();
  return <MaintenanceActivityOrderDetailPage name={name} />;
}

async function renderDetail() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [
        "/business-data/maintenance-activity-order/$name".replace(
          "$name",
          encodeURIComponent(ENTITY),
        ),
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
  expect(await capturePageViews({ expected: parity })).toEqual(parity);
});
