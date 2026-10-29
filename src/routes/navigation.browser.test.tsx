import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { beforeEach, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { routeTree } from "@/routeTree.gen";
import { useTabsStore } from "@/stores/tabs-store";

function renderAt(path: string) {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

async function waitForText(text: string) {
  const started = Date.now();
  while (Date.now() - started < 10000) {
    if (document.body.innerText.includes(text)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  expect(document.body.innerText).toContain(text);
}

beforeEach(() => {
  useTabsStore.setState({ tabs: [], active: null });
});

test("detail route renders the detail screen and the list tab navigates back", async () => {
  const screen = renderAt("/detail/AIAgent");
  await expect.element(screen.getByText("MCP Servers")).toBeVisible();
  await screen.getByText("Entity Types").click();
  await waitForText("Entity Types (393)");
  await expect.element(screen.getByText("Entity Types (393)")).toBeVisible();
});

test("sidebar navigation opens a module screen", async () => {
  const screen = renderAt("/");
  await expect.element(screen.getByText("Entity Types (393)")).toBeVisible();
  await screen.getByRole("button", { name: "Tools" }).click();
  await waitForText("Tools (4)");
  await expect.element(screen.getByText("Tools (4)")).toBeVisible();
});
