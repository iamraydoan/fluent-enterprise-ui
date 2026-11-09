import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test } from "vitest";
import { pageFingerprint, renderWithAppTheme } from "@/test-utils";
import { ConfigurationDetailPage } from "./ConfigurationDetailPage";
import parity from "./ConfigurationDetailPage.parity.json";

const CONFIG_PATH =
  "/Cmf/System/Configuration/LDAP/Credentials/dc02.cmf.criticalmanufacturing.com/UserPassword/";

export async function pageViews() {
  const sectionButtons = Array.from(document.querySelectorAll<HTMLElement>("aside button")).filter(
    (button) => !button.getAttribute("aria-label"),
  );
  const tabButtons = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'));
  const buttons = sectionButtons.length > 0 ? sectionButtons : tabButtons;
  if (buttons.length === 0) {
    return { walk: "page", views: { page: pageFingerprint() } };
  }
  const views: Record<string, unknown> = {};
  for (const button of buttons) {
    button.click();
    await new Promise((resolve) => setTimeout(resolve, 300));
    const label = (button.textContent ?? "").trim() || "unknown";
    views[label] = pageFingerprint();
  }
  return { walk: sectionButtons.length > 0 ? "sections" : "tabs", views };
}

test("keeps every card, grid and field row in every section", async () => {
  const screen = await renderWithAppTheme(
    <QueryClientProvider client={new QueryClient()}>
      <ConfigurationDetailPage path={CONFIG_PATH} />
    </QueryClientProvider>,
  );
  await expect.element(screen.getByText("UserPassword").first()).toBeVisible();
  expect(await pageViews()).toEqual(parity);
});
