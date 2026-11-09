import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test } from "vitest";
import { captureWalkViews, renderWithAppTheme } from "@/test-utils";
import { ConfigurationDetailPage } from "./ConfigurationDetailPage";
import parity from "./ConfigurationDetailPage.parity.json";

const CONFIG_PATH =
  "/Cmf/System/Configuration/LDAP/Credentials/dc02.cmf.criticalmanufacturing.com/UserPassword/";

test("keeps every card, grid and field row in every section", async () => {
  const screen = await renderWithAppTheme(
    <QueryClientProvider client={new QueryClient()}>
      <ConfigurationDetailPage path={CONFIG_PATH} />
    </QueryClientProvider>,
  );
  await expect.element(screen.getByText("UserPassword").first()).toBeVisible();
  expect(await captureWalkViews()).toEqual(parity);
});
