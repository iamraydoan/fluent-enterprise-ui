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
  css,
  detailSnapshot,
  expectDetailViews,
  pageFingerprint,
  renderWithAppTheme,
} from "@/test-utils";
import { ChecklistDetailPage } from "./ChecklistDetailPage";
import fingerprintParity from "./ChecklistDetailPage.fingerprint.json";
import items from "./ChecklistDetailPage.items.json";
import parity from "./ChecklistDetailPage.parity.json";

const rootRoute = createRootRoute();
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-data/checklist/$name",
  component: ChecklistDetailPage,
});
const routeTree = rootRoute.addChildren([detailRoute]);

const ENTITY = "Material Deviation Checklist 002";

async function renderDetail() {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: ["/business-data/checklist/" + encodeURIComponent(ENTITY)],
    }),
  });
  return await renderWithAppTheme(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

function itemsInventory() {
  const grids = Array.from(document.querySelectorAll<HTMLElement>("div"))
    .filter((element) => getComputedStyle(element).display === "grid")
    .map((element) => ({
      inlineTemplate: element.style.gridTemplateColumns,
      computedTemplate: getComputedStyle(element).gridTemplateColumns,
      rowGap: css(element, "row-gap"),
      columnGap: css(element, "column-gap"),
    }));
  const rows = Array.from(document.querySelectorAll<HTMLElement>("span"))
    .filter((span) => /:$/.test(span.textContent ?? "") && span.parentElement)
    .map((label) => {
      const row = label.parentElement as HTMLElement;
      const value = row.children[1] as HTMLElement;
      return {
        label: {
          color: css(label, "color"),
          minWidth: css(label, "min-width"),
          fontSize: css(label, "font-size"),
        },
        value: { fontSize: css(value, "font-size"), color: css(value, "color") },
        row: {
          display: css(row, "display"),
          columnGap: css(row, "column-gap"),
          fontSize: css(row, "font-size"),
        },
      };
    });
  return { grids, rows };
}

test("keeps every detail card and field in every section", async () => {
  const screen = await renderDetail();
  await expect.element(screen.getByText(ENTITY).first()).toBeVisible();
  await expect
    .poll(() => document.querySelectorAll('[style*="grid-template-columns"]').length)
    .toBeGreaterThan(0);
  await expectDetailViews(parity);
});

test("keeps the items tab inventory", async () => {
  const screen = await renderDetail();
  await expect.element(screen.getByText(ENTITY).first()).toBeVisible();
  await screen.getByRole("tab", { name: "Checklist Items" }).click();
  await expect
    .poll(() => document.querySelectorAll('[style*="grid-template-columns"]').length)
    .toBeGreaterThan(0);
  expect({ snapshot: detailSnapshot(), inventory: itemsInventory() }).toEqual(items);
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
