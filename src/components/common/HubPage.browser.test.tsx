import type { ReactNode } from "react";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { HubPage } from "@/components/common/HubPage";
import { FluentProvider } from "@/components/ui";
import { initI18n } from "@/i18n";

function renderHub(ui: ReactNode) {
  localStorage.setItem("fluent-enterprise-ui:language", "en");
  initI18n();
  return render(<FluentProvider>{ui}</FluentProvider>);
}

const TILES = [
  {
    id: "alpha",
    labelKey: "common.search",
    icon: <span aria-hidden="true" />,
    route: "/alpha",
  },
  {
    id: "beta",
    labelKey: "common.cancel",
    icon: <span aria-hidden="true" />,
    route: "/beta",
  },
  {
    id: "gamma",
    labelKey: "common.close",
    icon: <span aria-hidden="true" />,
    route: "/gamma",
  },
] as const;

test("renders one tile per entry", async () => {
  const screen = await renderHub(
    <HubPage tiles={[...TILES]} ariaLabelKey="common.search" onTileClick={() => {}} />,
  );
  await expect.element(screen.getByText("Search")).toBeVisible();
  await expect.element(screen.getByText("Cancel")).toBeVisible();
  await expect.element(screen.getByText("Close")).toBeVisible();
});

test("clicking a tile reports its route", async () => {
  const onTileClick = vi.fn();
  const screen = await renderHub(
    <HubPage tiles={[...TILES]} ariaLabelKey="common.search" onTileClick={onTileClick} />,
  );
  await screen.getByText("Cancel").click();
  expect(onTileClick).toHaveBeenCalledWith("/beta");
});

test("search filters tiles by label", async () => {
  const screen = await renderHub(
    <HubPage tiles={[...TILES]} ariaLabelKey="common.search" onTileClick={() => {}} />,
  );
  await screen.getByPlaceholder("Search").fill("xyz-no-match");
  expect(document.body.innerText).not.toContain("Cancel");
  expect(document.body.innerText).not.toContain("Close");
  await screen.getByPlaceholder("Search").fill("");
  await expect.element(screen.getByText("Cancel")).toBeVisible();
});
