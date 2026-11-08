import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { FluentProvider } from "@/components/ui";
import { initI18n } from "@/i18n";
import { lightTheme } from "@/theme";
import { AreaDetailPage } from "./AreaDetailPage";

const rootRoute = createRootRoute();
const areaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-data/area/$name",
  component: AreaDetailPage,
});
const routeTree = rootRoute.addChildren([areaRoute]);

const AREA_NAME = "Mixing";

async function renderAreaDetail() {
  localStorage.setItem("fluent-enterprise-ui:language", "en");
  await initI18n();
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/business-data/area/" + AREA_NAME] }),
  });
  return await render(
    <QueryClientProvider client={queryClient}>
      <FluentProvider theme={lightTheme}>
        <RouterProvider router={router} />
      </FluentProvider>
    </QueryClientProvider>,
  );
}

function css(element: Element, property: string) {
  return getComputedStyle(element).getPropertyValue(property);
}

function detailParts() {
  const label = document.querySelectorAll("span");
  const nameLabel = Array.from(label).find((span) => span.textContent === "Name:");
  if (!nameLabel) throw new Error("Name label not found");
  const row = nameLabel.parentElement as HTMLElement;
  const card = row.parentElement as HTMLElement;
  const grid = card.parentElement as HTMLElement;
  const header = card.children[0] as HTMLElement;
  const headerText = header.querySelector("span") as HTMLElement;
  return { nameLabel, row, card, grid, header, headerText, value: row.children[1] as HTMLElement };
}

test("renders the area detail cards and fields", async () => {
  const screen = await renderAreaDetail();
  await expect.element(screen.getByText("Mixing (Active)")).toBeVisible();
  await expect.element(screen.getByText("Area").first()).toBeVisible();
  await expect.element(screen.getByText("Information")).toBeVisible();
  await expect.element(screen.getByText("Planning")).toBeVisible();
  await expect.element(screen.getByText("Shift Logbooks")).toBeVisible();
  await expect.element(screen.getByText("Name:")).toBeVisible();
  await expect.element(screen.getByText("Mixing process area")).toBeVisible();
});

test("pins the detail card and field computed styles", async () => {
  const screen = await renderAreaDetail();
  await expect.element(screen.getByText("Mixing (Active)")).toBeVisible();
  const { nameLabel, row, card, grid, header, headerText, value } = detailParts();
  expect(css(card, "padding")).toBe("8px 16px 0px");
  expect(css(card, "background-color")).toBe("rgb(250, 250, 250)");
  expect(css(card, "border-radius")).toBe("12px");
  expect(css(card, "margin-top")).toBe("10px");
  expect(css(card, "display")).toBe("flex");
  expect(css(card, "flex-direction")).toBe("column");
  expect(css(card, "row-gap")).toBe("12px");
  expect(css(grid, "row-gap")).toBe("12px");
  expect(css(grid, "column-gap")).toBe("12px");
  expect(css(header, "display")).toBe("flex");
  expect(css(header, "padding-bottom")).toBe("8px");
  expect(css(header, "border-bottom")).toBe("1px solid rgb(224, 224, 224)");
  expect(css(header, "margin-bottom")).toBe("12px");
  expect(css(headerText, "font-size")).toBe("16px");
  expect(css(headerText, "font-weight")).toBe("600");
  expect(css(headerText, "color")).toBe("rgb(36, 36, 36)");
  expect(css(row, "display")).toBe("flex");
  expect(css(row, "column-gap")).toBe("12px");
  expect(css(row, "font-size")).toBe("13px");
  expect(css(nameLabel, "color")).toBe("rgb(97, 97, 97)");
  expect(css(nameLabel, "min-width")).toBe("120px");
  expect(css(nameLabel, "font-size")).toBe("13px");
  expect(css(value, "font-size")).toBe("13px");
  expect(css(value, "color")).toBe("rgb(36, 36, 36)");
});
