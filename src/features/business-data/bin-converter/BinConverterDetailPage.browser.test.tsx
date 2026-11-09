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
  expectDetailCardParity,
  pageFingerprint,
  renderWithAppTheme,
} from "@/test-utils";
import { BinConverterDetailPage } from "./BinConverterDetailPage";
import fingerprintParity from "./BinConverterDetailPage.fingerprint.json";

const rootRoute = createRootRoute();
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-data/bin-converter/$name",
  component: BinConverterDetailPage,
});
const routeTree = rootRoute.addChildren([detailRoute]);

const ENTITY = "BinConverter_01";

async function renderDetail() {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: ["/business-data/bin-converter/" + encodeURIComponent(ENTITY)],
    }),
  });
  return await renderWithAppTheme(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

test("bin-converter detail keeps its measured card styles", async () => {
  const screen = await renderDetail();
  await expect.element(screen.getByText("Name:").first()).toBeVisible();
  expectDetailCardParity(140);
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
