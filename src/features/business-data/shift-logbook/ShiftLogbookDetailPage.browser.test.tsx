import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { expect, test } from "vitest";
import { capturePageViews, expectDetailSnapshot, renderWithAppTheme } from "@/test-utils";
import { ShiftLogbookDetailPage } from "./ShiftLogbookDetailPage";
import parity from "./ShiftLogbookDetailPage.parity.json";
import positions from "./ShiftLogbookDetailPage.positions.json";

const rootRoute = createRootRoute();
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-data/shift-logbook/$name",
  component: ShiftLogbookDetailPageRoute,
});
const routeTree = rootRoute.addChildren([detailRoute]);
const ENTITY = "Area-01 Shift 1 2026-10-30";

function ShiftLogbookDetailPageRoute() {
  const { name } = detailRoute.useParams();
  return <ShiftLogbookDetailPage name={name} />;
}

async function renderDetail() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [
        "/business-data/shift-logbook/$name".replace("$name", encodeURIComponent(ENTITY)),
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

test("keeps the handover summary card metrics", async () => {
  const screen = await renderDetail();
  await expect.element(screen.getByText(ENTITY).first()).toBeVisible();
  const before = document.querySelectorAll("div").length;
  const trigger = document.querySelector('[aria-haspopup="menu"]') as HTMLElement | null;
  expect(trigger).not.toBeNull();
  trigger?.click();
  await screen.getByRole("menuitem", { name: /summary|handover/i }).click();
  await expect.poll(() => document.querySelectorAll("div").length).toBeGreaterThan(before);
  expectDetailSnapshot(positions);
});
