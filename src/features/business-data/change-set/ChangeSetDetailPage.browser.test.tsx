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
import { ChangeSetDetailPage } from "./ChangeSetDetailPage";
import fingerprintParity from "./ChangeSetDetailPage.fingerprint.json";
import parity from "./ChangeSetDetailPage.parity.json";

const rootRoute = createRootRoute();
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-data/change-set/$name",
  component: ChangeSetDetailPage,
});
const routeTree = rootRoute.addChildren([detailRoute]);

const ENTITY = "ChangeSetName";

async function renderDetail() {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: ["/business-data/change-set/" + encodeURIComponent(ENTITY)],
    }),
  });
  return await renderWithAppTheme(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

test("change-set keeps every detail card and field in every section", async () => {
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
