import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { beforeEach, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { i18n, initI18n, storedLanguage } from "@/i18n";
import { routeTree } from "@/routeTree.gen";
import { useTabsStore } from "@/stores/tabs-store";

const LANGUAGE_KEY = "fluent-enterprise-ui:language";

function renderAt(path: string) {
  initI18n();
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

function languageButton(): HTMLButtonElement {
  const button = document.querySelector('button[aria-label="Language"]');
  if (!button) throw new Error("Language switcher button not found");
  return button as HTMLButtonElement;
}

beforeEach(async () => {
  localStorage.setItem(LANGUAGE_KEY, "en");
  if (i18n.isInitialized) await i18n.changeLanguage("en");
  useTabsStore.setState({ tabs: [], active: null });
});

async function switchLanguage(menuLabel: string) {
  languageButton().click();
  const started = Date.now();
  while (Date.now() - started < 10000) {
    const item = Array.from(document.querySelectorAll('[role="menuitemradio"]')).find(
      (element) => element.textContent?.trim() === menuLabel,
    );
    if (item) {
      (item as HTMLElement).click();
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Language menu item not found: ${menuLabel}`);
}

async function expectLanguage(code: "vi" | "ja" | "ko", menuLabel: string) {
  initI18n();
  const tabTitle = i18n.t("nav.tiles.entityTypes", { lng: code });
  const listTitle = i18n.t("entityTypes.title", { lng: code, count: 393 });
  renderAt("/administration/entity-types");
  await waitForText("Entity Types (393)");
  await switchLanguage(menuLabel);
  await waitForText(tabTitle);
  await waitForText(listTitle);
  expect(localStorage.getItem(LANGUAGE_KEY)).toBe(code);
  expect(document.body.innerText).toContain(code.toUpperCase());
  expect(document.body.innerText).not.toContain("entityTypes.title");
  expect(document.body.innerText).not.toContain("nav.sections.administration");
  expect(document.body.innerText).not.toContain("aiAgent.listTitle");
}

test("switches to Vietnamese and persists the choice", async () => {
  await expectLanguage("vi", "Tiếng Việt");
});

test("switches to Japanese and persists the choice", async () => {
  await expectLanguage("ja", "日本語");
});

test("switches to Korean and persists the choice", async () => {
  await expectLanguage("ko", "한국어");
});

test("lists all four languages with native labels", async () => {
  renderAt("/administration/entity-types");
  await waitForText("Entity Types (393)");
  languageButton().click();
  const started = Date.now();
  while (Date.now() - started < 10000) {
    const found = ["English", "Tiếng Việt", "日本語", "한국어"].every((label) =>
      document.body.innerText.includes(label),
    );
    if (found) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  for (const label of ["English", "Tiếng Việt", "日本語", "한국어"]) {
    expect(document.body.innerText).toContain(label);
  }
});

test("reads the initial language from localStorage with validation", () => {
  localStorage.setItem(LANGUAGE_KEY, "ko");
  expect(storedLanguage()).toBe("ko");
  localStorage.setItem(LANGUAGE_KEY, "xx-not-a-language");
  expect(storedLanguage()).toBe("en");
  localStorage.removeItem(LANGUAGE_KEY);
  expect(storedLanguage()).toBe("en");
});
