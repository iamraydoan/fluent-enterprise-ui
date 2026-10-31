import type { ReactNode } from "react";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { DetailShell } from "@/components/common/DetailShell";
import { FluentProvider } from "@/components/ui";
import { initI18n } from "@/i18n";

function renderShell(ui: ReactNode) {
  localStorage.setItem("fluent-enterprise-ui:language", "en");
  initI18n();
  return render(<FluentProvider>{ui}</FluentProvider>);
}

const TOP_TABS = [
  { value: "details", labelKey: "common.detailsView" },
  { value: "history", labelKey: "common.search" },
] as const;

const LEFT_ITEMS = ["common.search", "common.cancel"] as const;

function shellProps(overrides: Record<string, unknown> = {}) {
  return {
    title: "Mixer-01",
    icon: <span aria-hidden="true" />,
    topTabs: [...TOP_TABS],
    top: "details",
    onTop: () => {},
    leftItems: [...LEFT_ITEMS],
    left: "common.search",
    onLeft: () => {},
    onEdit: () => {},
    onAskAi: () => {},
    children: <span>detail content</span>,
    ...overrides,
  };
}

test("renders title and children", async () => {
  const screen = await renderShell(<DetailShell {...shellProps()} />);
  await expect.element(screen.getByText("Mixer-01")).toBeVisible();
  await expect.element(screen.getByText("detail content")).toBeVisible();
});

test("clicking a top tab reports its value", async () => {
  const onTop = vi.fn();
  const screen = await renderShell(<DetailShell {...shellProps({ onTop })} />);
  await screen.getByRole("tab", { name: "Search" }).click();
  expect(onTop).toHaveBeenCalledWith("history");
});

test("clicking Edit calls onEdit", async () => {
  const onEdit = vi.fn();
  const screen = await renderShell(<DetailShell {...shellProps({ onEdit })} />);
  await screen.getByText("Edit").click();
  expect(onEdit).toHaveBeenCalledTimes(1);
});

test("clicking a left panel item reports its key", async () => {
  const onLeft = vi.fn();
  await renderShell(<DetailShell {...shellProps({ onLeft })} />);
  const aside = document.querySelector("aside");
  expect(aside).not.toBeNull();
  const buttons = Array.from(aside?.querySelectorAll("button") ?? []);
  expect(buttons.map((button) => button.textContent?.trim())).toContain("Cancel");
  const cancelButton = buttons.find(
    (button) => button.textContent?.trim() === "Cancel",
  );
  cancelButton?.click();
  expect(onLeft).toHaveBeenCalledWith("common.cancel");
});
