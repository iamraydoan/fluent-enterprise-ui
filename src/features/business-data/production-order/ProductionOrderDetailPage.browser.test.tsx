import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { expect, test } from "vitest";
import { detailSnapshot, pageFingerprint, renderWithAppTheme } from "@/test-utils";
import { ProductionOrderDetailPage } from "./ProductionOrderDetailPage";
import parity from "./ProductionOrderDetailPage.parity.json";

const rootRoute = createRootRoute();
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-data/production-order/$name",
  component: ProductionOrderDetailPageRoute,
});
const routeTree = rootRoute.addChildren([detailRoute]);
const ENTITY = "PO-0001";

function ProductionOrderDetailPageRoute() {
  const { name } = detailRoute.useParams();
  return <ProductionOrderDetailPage name={name} />;
}

function cardSnapshot() {
  try {
    return detailSnapshot();
  } catch {
    return null;
  }
}

async function renderDetail() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [
        "/business-data/production-order/$name".replace("$name", encodeURIComponent(ENTITY)),
      ],
    }),
  });
  return await renderWithAppTheme(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

export async function pageViews() {
  const buttons = Array.from(document.querySelectorAll<HTMLElement>("aside button")).filter(
    (button) => !button.getAttribute("aria-label"),
  );
  const views: Record<string, unknown> = {};
  for (const button of buttons) {
    button.click();
    await new Promise((resolve) => setTimeout(resolve, 120));
    views[(button.textContent ?? "unknown").trim()] = {
      snapshot: cardSnapshot(),
      fingerprint: pageFingerprint(),
    };
  }
  return views;
}

test("keeps every card, grid and field row in every section", async () => {
  const screen = await renderDetail();
  await expect.element(screen.getByText(ENTITY).first()).toBeVisible();
  await expect
    .poll(() => document.querySelectorAll('[style*="grid-template-columns"]').length)
    .toBeGreaterThan(0);
  expect(await pageViews()).toEqual(parity);
});
