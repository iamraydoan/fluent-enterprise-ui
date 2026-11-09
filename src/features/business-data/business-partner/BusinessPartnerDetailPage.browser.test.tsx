import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { expect, test } from "vitest";
import { capturePageViews, expectDetailCardParity, renderWithAppTheme } from "@/test-utils";
import { BusinessPartnerDetailPage } from "./BusinessPartnerDetailPage";
import fingerprintParity from "./BusinessPartnerDetailPage.fingerprint.json";

const rootRoute = createRootRoute();
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-data/business-partner/$name",
  component: BusinessPartnerDetailPage,
});
const routeTree = rootRoute.addChildren([detailRoute]);

const ENTITY = "Cooking Mining Company";

async function renderDetail() {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: ["/business-data/business-partner/" + encodeURIComponent(ENTITY)],
    }),
  });
  return await renderWithAppTheme(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

test("business-partner detail keeps its measured card styles", async () => {
  const screen = await renderDetail();
  await expect.element(screen.getByText("Name:").first()).toBeVisible();
  expectDetailCardParity(140);
});

test("keeps every card, grid and field row in every section", async () => {
  const screen = await renderDetail();
  await expect.element(screen.getByText(ENTITY).first()).toBeVisible();
  await expect
    .poll(() => document.querySelectorAll('[style*="grid-template-columns"]').length)
    .toBeGreaterThan(0);
  expect(await capturePageViews({ includeDefault: true, expected: fingerprintParity })).toEqual(
    fingerprintParity,
  );
});
