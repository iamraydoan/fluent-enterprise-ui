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
  detailSnapshot,
  expectDetailViews,
  pageFingerprint,
  renderWithAppTheme,
} from "@/test-utils";
import { DataCollectionLimitSetDetailPage } from "./DataCollectionLimitSetDetailPage";
import fingerprintParity from "./DataCollectionLimitSetDetailPage.fingerprint.json";
import parity from "./DataCollectionLimitSetDetailPage.parity.json";

const rootRoute = createRootRoute();
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-data/data-collection-limit-set/$name",
  component: DataCollectionLimitSetDetailPage,
});
const routeTree = rootRoute.addChildren([detailRoute]);

const ENTITY = "Cookie Inspection Limits 001";

async function renderDetail() {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: ["/business-data/data-collection-limit-set/" + encodeURIComponent(ENTITY)],
    }),
  });
  return await renderWithAppTheme(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

test("data-collection-limit-set keeps every detail card and field in every section", async () => {
  const screen = await renderDetail();
  await expect.element(screen.getByText(ENTITY).first()).toBeVisible();
  await expect
    .poll(() => document.querySelectorAll('[style*="grid-template-columns"]').length)
    .toBeGreaterThan(0);
  await expectDetailViews(parity);
});

function cardSnapshot() {
  try {
    return detailSnapshot();
  } catch {
    return null;
  }
}

async function pageViews() {
  const views: Record<string, unknown> = {
    default: { snapshot: cardSnapshot(), fingerprint: pageFingerprint() },
  };
  const buttons = Array.from(document.querySelectorAll<HTMLElement>("aside button")).filter(
    (button) => !button.getAttribute("aria-label"),
  );
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
  expect(await pageViews()).toEqual(fingerprintParity);
});
