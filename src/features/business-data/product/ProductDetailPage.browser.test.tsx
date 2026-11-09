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
import { ProductDetailPage } from "./ProductDetailPage";
import parity from "./ProductDetailPage.parity.json";

const rootRoute = createRootRoute();
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-data/product/$name",
  component: ProductDetailPageRoute,
});
const routeTree = rootRoute.addChildren([detailRoute]);
const ENTITY = "Flour [A]";

function ProductDetailPageRoute() {
  const { name } = detailRoute.useParams();
  return <ProductDetailPage name={name} />;
}

async function renderDetail() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: ["/business-data/product/$name".replace("$name", encodeURIComponent(ENTITY))],
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
  expect(await capturePageViews({ expected: parity })).toEqual(parity);
});
