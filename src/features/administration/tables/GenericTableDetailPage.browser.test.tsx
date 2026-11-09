import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test } from "vitest";
import { captureWalkViews, renderWithAppTheme } from "@/test-utils";
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

test("keeps every card, grid and field row in every section", async () => {
  await renderPage();
  await expect.poll(() => document.body.innerText.includes(TABLE_NAME)).toBe(true);
  expect(await captureWalkViews(parity)).toEqual(parity);
});
