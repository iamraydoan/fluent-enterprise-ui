import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test } from "vitest";
import { pageFingerprint, renderWithAppTheme } from "@/test-utils";
import { GenericTableDetailPage } from "./GenericTableDetailPage";
import parity from "./GenericTableDetailPage.parity.json";

const TABLE_NAME = "AQLAcceptanceQualityLimit";

async function renderPage() {
  return await renderWithAppTheme(
    <QueryClientProvider client={new QueryClient()}>
      <GenericTableDetailPage name={TABLE_NAME} />
    </QueryClientProvider>,
  );
}

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
  await renderPage();
  await expect.poll(() => document.body.innerText.includes(TABLE_NAME)).toBe(true);
  expect(await pageViews()).toEqual(parity);
});
