import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { expect, test } from "vitest";
import {
  capturePageViews,
  expectDetailSnapshot,
  expectDetailViews,
  renderWithAppTheme,
} from "@/test-utils";
import { ContainerDetailPage } from "./ContainerDetailPage";
import fingerprintParity from "./ContainerDetailPage.fingerprint.json";
import parity from "./ContainerDetailPage.parity.json";
import positions from "./ContainerDetailPage.positions.json";

const rootRoute = createRootRoute();
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-data/container/$name",
  component: ContainerDetailPage,
});
const routeTree = rootRoute.addChildren([detailRoute]);

const ENTITY = "Container 001";

async function renderDetail() {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: ["/business-data/container/" + encodeURIComponent(ENTITY)],
    }),
  });
  return await renderWithAppTheme(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

test("container keeps every detail card and field in every section", async () => {
  const screen = await renderDetail();
  await expect.element(screen.getByText(ENTITY).first()).toBeVisible();
  await expect
    .poll(() => document.querySelectorAll('[style*="grid-template-columns"]').length)
    .toBeGreaterThan(0);
  await expectDetailViews(parity);
});

test("container keeps the positions tab cards", async () => {
  const screen = await renderDetail();
  await expect.element(screen.getByText(ENTITY).first()).toBeVisible();
  await screen.getByRole("tab", { name: "Container" }).click();
  await expect
    .poll(() => document.querySelectorAll('[style*="grid-template-columns"]').length)
    .toBeGreaterThan(0);
  expectDetailSnapshot(positions);
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
