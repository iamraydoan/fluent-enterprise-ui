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
import { ShiftPlanDetailPage } from "./ShiftPlanDetailPage";
import parity from "./ShiftPlanDetailPage.parity.json";

const rootRoute = createRootRoute();
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-data/shift-plan/$name",
  component: ShiftPlanDetailPageRoute,
});
const routeTree = rootRoute.addChildren([detailRoute]);
const ENTITY = "Cookie Factory Shift Plan";

function ShiftPlanDetailPageRoute() {
  const { name } = detailRoute.useParams();
  return <ShiftPlanDetailPage name={name} />;
}

async function renderDetail() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [
        "/business-data/shift-plan/$name".replace("$name", encodeURIComponent(ENTITY)),
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
