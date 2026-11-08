import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { expect, test } from "vitest";
import { css, expectDetailViews, renderWithAppTheme } from "@/test-utils";
import { DataCollectionDetailPage } from "./DataCollectionDetailPage";
import limits from "./DataCollectionDetailPage.limits.json";
import parity from "./DataCollectionDetailPage.parity.json";

const rootRoute = createRootRoute();
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-data/data-collection/$name",
  component: DataCollectionDetailPage,
});
const routeTree = rootRoute.addChildren([detailRoute]);

const ENTITY = "Cookie Inspection 001";

async function renderDetail() {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: ["/business-data/data-collection/" + encodeURIComponent(ENTITY)],
    }),
  });
  return await renderWithAppTheme(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

function limitSetsInventory() {
  const cards = Array.from(document.querySelectorAll<HTMLElement>("div")).filter(
    (element) =>
      getComputedStyle(element).backgroundColor === "rgb(250, 250, 250)" &&
      getComputedStyle(element).borderRadius === "12px",
  );
  const leaves = (row: HTMLElement) =>
    Array.from(row.querySelectorAll<HTMLElement>("*")).filter(
      (element) =>
        Array.from(element.childNodes).some(
          (node) => node.nodeType === 3 && (node.textContent ?? "").trim() !== "",
        ) || element.tagName === "BUTTON",
    );
  return cards.map((card) => {
    const header = card.children[0] as HTMLElement;
    const title = Array.from(header.querySelectorAll<HTMLElement>("span")).find(
      (span) => getComputedStyle(span).fontWeight === "600",
    ) as HTMLElement;
    const rows = Array.from(card.children).slice(1) as HTMLElement[];
    return {
      card: {
        padding: css(card, "padding"),
        backgroundColor: css(card, "background-color"),
        borderRadius: css(card, "border-radius"),
        marginTop: css(card, "margin-top"),
        display: css(card, "display"),
        flexDirection: css(card, "flex-direction"),
        rowGap: css(card, "row-gap"),
      },
      header: {
        display: css(header, "display"),
        alignItems: css(header, "align-items"),
        justifyContent: css(header, "justify-content"),
        columnGap: css(header, "column-gap"),
        marginBottom: css(header, "margin-bottom"),
      },
      title: {
        fontSize: css(title, "font-size"),
        fontWeight: css(title, "font-weight"),
        color: css(title, "color"),
        paddingBottom: css(title, "padding-bottom"),
        borderBottom: css(title, "border-bottom"),
      },
      rows: rows.map((row) => ({
        display: css(row, "display"),
        columnGap: css(row, "column-gap"),
        fontSize: css(row, "font-size"),
        padding: css(row, "padding"),
        borderBottom: css(row, "border-bottom"),
        leaves: leaves(row).map((leaf) => ({
          fontSize: css(leaf, "font-size"),
          fontWeight: css(leaf, "font-weight"),
          color: css(leaf, "color"),
          padding: css(leaf, "padding"),
          borderBottom: css(leaf, "border-bottom"),
          text: (leaf.textContent ?? "").trim(),
        })),
      })),
    };
  });
}

async function openLeftSection(screen: Awaited<ReturnType<typeof renderDetail>>, label: string) {
  await expect.element(screen.getByText(ENTITY).first()).toBeVisible();
  await expect.poll(() => document.querySelectorAll("aside button").length).toBeGreaterThan(0);
  const buttons = Array.from(document.querySelectorAll<HTMLElement>("aside button")).filter(
    (button) => !button.getAttribute("aria-label"),
  );
  buttons.find((button) => button.textContent?.trim() === label)?.click();
}

test("keeps every detail card and field in every section", async () => {
  const screen = await renderDetail();
  await expect.element(screen.getByText(ENTITY).first()).toBeVisible();
  await expect
    .poll(() => document.querySelectorAll('[style*="grid-template-columns"]').length)
    .toBeGreaterThan(0);
  await expectDetailViews(parity);
});

test("keeps the limit sets card inventory", async () => {
  const screen = await renderDetail();
  await openLeftSection(screen, "Limit Sets");
  await expect.poll(() => limitSetsInventory().length).toBe(1);
  expect(limitSetsInventory()).toEqual(limits);
});
