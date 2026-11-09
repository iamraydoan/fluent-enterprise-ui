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
import { ProtocolDetailPage } from "./ProtocolDetailPage";
import parity from "./ProtocolDetailPage.parity.json";

const rootRoute = createRootRoute();
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-data/protocol/$name",
  component: ProtocolDetailPageRoute,
});
const routeTree = rootRoute.addChildren([detailRoute]);
const ENTITY = "Cleaning-01";

function ProtocolDetailPageRoute() {
  const { name } = detailRoute.useParams();
  return <ProtocolDetailPage name={name} />;
}

async function renderDetail() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [
        "/business-data/protocol/$name".replace("$name", encodeURIComponent(ENTITY)),
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
  await expect
    .poll(() => document.querySelectorAll('[style*="grid-template-columns"]').length)
    .toBeGreaterThan(0);
  expect(await capturePageViews()).toEqual(parity);
});
