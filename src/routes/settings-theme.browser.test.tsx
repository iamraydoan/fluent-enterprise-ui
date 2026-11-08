import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { DEFAULT_THEME_SETTINGS } from "@/features/settings/settings-config";
import {
  THEME_SETTINGS_STORAGE_KEY,
  useThemeSettingsStore,
} from "@/features/settings/settings-store";
import { initI18n } from "@/i18n";
import { routeTree } from "@/routeTree.gen";

async function renderAt(path: string) {
  localStorage.setItem("fluent-enterprise-ui:language", "en");
  await initI18n();
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  return await render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

function styleOf(selector: string, property: string) {
  const element = document.querySelector(selector);
  return element ? getComputedStyle(element).getPropertyValue(property) : null;
}

function allValues(property: string) {
  return Array.from(document.querySelectorAll<HTMLElement>("*"))
    .map((element) => getComputedStyle(element).getPropertyValue(property))
    .filter((value) => value !== "normal" && value !== "");
}

beforeEach(() => {
  localStorage.clear();
  useThemeSettingsStore.setState({ ...DEFAULT_THEME_SETTINGS });
});

afterEach(() => {
  useThemeSettingsStore.setState({ ...DEFAULT_THEME_SETTINGS });
  localStorage.removeItem(THEME_SETTINGS_STORAGE_KEY);
});

test("brand colour reaches a rendered primary action", async () => {
  const screen = await renderAt("/settings");
  await expect.element(screen.getByRole("radiogroup", { name: "Brand colour" })).toBeVisible();
  const primaryButton = screen.getByRole("button", { name: "Primary action" });
  await expect.element(primaryButton).toBeVisible();
  expect(getComputedStyle(primaryButton.element() as HTMLElement).backgroundColor).toBe(
    "rgb(15, 108, 189)",
  );
  useThemeSettingsStore.getState().setBrand("teal");
  await vi.waitFor(() => {
    expect(getComputedStyle(primaryButton.element() as HTMLElement).backgroundColor).toBe(
      "rgb(3, 131, 135)",
    );
  });
});

test("colour scheme reaches the rendered shell", async () => {
  const screen = await renderAt("/administration");
  await expect.element(screen.getByText("Configuration")).toBeVisible();
  expect(styleOf(".fui-FluentProvider", "background-color")).toBe("rgb(255, 255, 255)");
  useThemeSettingsStore.getState().setScheme("dark");
  await vi.waitFor(() => {
    expect(styleOf(".fui-FluentProvider", "background-color")).toBe("rgb(41, 41, 41)");
  });
});

test("corner radius reaches rendered components", async () => {
  const screen = await renderAt("/administration");
  await expect.element(screen.getByText("Configuration")).toBeVisible();
  expect(styleOf(".fui-Input", "border-top-left-radius")).toBe("4px");
  useThemeSettingsStore.getState().setRadius("square");
  await vi.waitFor(() => {
    expect(styleOf(".fui-Input", "border-top-left-radius")).toBe("0px");
  });
});

test("density reaches rendered spacing", async () => {
  const screen = await renderAt("/settings");
  await expect.element(screen.getByRole("radiogroup", { name: "Brand colour" })).toBeVisible();
  expect(allValues("row-gap")).toContain("16px");
  useThemeSettingsStore.getState().setDensity("compact");
  await vi.waitFor(() => {
    expect(allValues("row-gap")).toContain("12px");
  });
});

test("content width reaches the app shell", async () => {
  const screen = await renderAt("/administration");
  await expect.element(screen.getByText("Configuration")).toBeVisible();
  expect(styleOf("#theme-shell", "max-width")).toBe("none");
  useThemeSettingsStore.getState().setContentWidth("narrow");
  await vi.waitFor(() => {
    expect(styleOf("#theme-shell", "max-width")).toBe("1200px");
  });
});

test("sidebar layout drives the shell grid and the shell toggle writes the same store value", async () => {
  const screen = await renderAt("/administration");
  await expect.element(screen.getByText("Configuration")).toBeVisible();
  expect(
    styleOf('[style*="grid-template-columns"]', "grid-template-columns")?.startsWith("48px"),
  ).toBe(true);
  useThemeSettingsStore.getState().setSidebarLayout("expanded");
  await vi.waitFor(() => {
    expect(
      styleOf('[style*="grid-template-columns"]', "grid-template-columns")?.startsWith("220px"),
    ).toBe(true);
  });
  const toggle = document.querySelector("nav button");
  expect(toggle?.getAttribute("aria-expanded")).toBe("true");
  toggle?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await vi.waitFor(() => {
    expect(useThemeSettingsStore.getState().sidebarLayout).toBe("collapsed");
  });
  await vi.waitFor(() => {
    expect(
      styleOf('[style*="grid-template-columns"]', "grid-template-columns")?.startsWith("48px"),
    ).toBe(true);
  });
});

test("settings panel controls are labelled and drive the store", async () => {
  const screen = await renderAt("/settings");
  await expect.element(screen.getByRole("radiogroup", { name: "Brand colour" })).toBeVisible();
  await expect.element(screen.getByRole("radiogroup", { name: "Colour scheme" })).toBeVisible();
  await expect.element(screen.getByRole("radiogroup", { name: "Corner radius" })).toBeVisible();
  await expect.element(screen.getByRole("radiogroup", { name: "Density" })).toBeVisible();
  await expect.element(screen.getByRole("radiogroup", { name: "Sidebar layout" })).toBeVisible();
  await expect.element(screen.getByRole("radiogroup", { name: "Content width" })).toBeVisible();
  const dark = screen.getByRole("radio", { name: "Dark" });
  await dark.click();
  expect(useThemeSettingsStore.getState().scheme).toBe("dark");
  const narrow = screen.getByRole("radio", { name: "Narrow" });
  await narrow.click();
  expect(useThemeSettingsStore.getState().contentWidth).toBe("narrow");
  const reset = screen.getByRole("button", { name: "Reset to defaults" });
  await reset.click();
  expect(useThemeSettingsStore.getState().scheme).toBe(DEFAULT_THEME_SETTINGS.scheme);
  expect(useThemeSettingsStore.getState().contentWidth).toBe(DEFAULT_THEME_SETTINGS.contentWidth);
});

const HOSTILE_PAYLOADS: [string, unknown][] = [
  ["an unknown brand string", { brand: "bogus" }],
  [
    "a wrong type for all six fields",
    { brand: 42, scheme: true, radius: [], density: {}, sidebarLayout: 7, contentWidth: null },
  ],
  ["an empty object", {}],
  ["a string payload", "nope"],
  ["a number payload", 42],
  ["a null payload", null],
  ["an array payload", [1, 2, 3]],
];

for (const [name, payload] of HOSTILE_PAYLOADS) {
  test("renders with defaults when the persisted payload is " + name, async () => {
    localStorage.setItem(
      THEME_SETTINGS_STORAGE_KEY,
      JSON.stringify({ state: payload, version: 0 }),
    );
    await useThemeSettingsStore.persist.rehydrate();
    const screen = await renderAt("/settings");
    await expect.element(screen.getByRole("radiogroup", { name: "Brand colour" })).toBeVisible();
    const state = useThemeSettingsStore.getState();
    expect(state.brand).toBe(DEFAULT_THEME_SETTINGS.brand);
    expect(state.scheme).toBe(DEFAULT_THEME_SETTINGS.scheme);
    expect(state.radius).toBe(DEFAULT_THEME_SETTINGS.radius);
    expect(state.density).toBe(DEFAULT_THEME_SETTINGS.density);
    expect(state.sidebarLayout).toBe(DEFAULT_THEME_SETTINGS.sidebarLayout);
    expect(state.contentWidth).toBe(DEFAULT_THEME_SETTINGS.contentWidth);
    expect(styleOf(".fui-FluentProvider", "background-color")).toBe("rgb(255, 255, 255)");
  });
}

test("fills missing fields with defaults and keeps valid ones", async () => {
  localStorage.setItem(
    THEME_SETTINGS_STORAGE_KEY,
    JSON.stringify({ state: { brand: "teal" }, version: 0 }),
  );
  await useThemeSettingsStore.persist.rehydrate();
  const screen = await renderAt("/settings");
  await expect.element(screen.getByRole("radiogroup", { name: "Brand colour" })).toBeVisible();
  const state = useThemeSettingsStore.getState();
  expect(state.brand).toBe("teal");
  expect(state.scheme).toBe(DEFAULT_THEME_SETTINGS.scheme);
  expect(state.radius).toBe(DEFAULT_THEME_SETTINGS.radius);
  expect(state.density).toBe(DEFAULT_THEME_SETTINGS.density);
  expect(state.sidebarLayout).toBe(DEFAULT_THEME_SETTINGS.sidebarLayout);
  expect(state.contentWidth).toBe(DEFAULT_THEME_SETTINGS.contentWidth);
});

test("keeps a valid persisted payload", async () => {
  localStorage.setItem(
    THEME_SETTINGS_STORAGE_KEY,
    JSON.stringify({
      state: {
        brand: "teal",
        scheme: "dark",
        radius: "square",
        density: "compact",
        sidebarLayout: "expanded",
        contentWidth: "narrow",
      },
      version: 0,
    }),
  );
  await useThemeSettingsStore.persist.rehydrate();
  const state = useThemeSettingsStore.getState();
  expect(state.brand).toBe("teal");
  expect(state.scheme).toBe("dark");
  expect(state.radius).toBe("square");
  expect(state.density).toBe("compact");
  expect(state.sidebarLayout).toBe("expanded");
  expect(state.contentWidth).toBe("narrow");
});

test("settings persist to local storage", async () => {
  const screen = await renderAt("/settings");
  await expect.element(screen.getByRole("radiogroup", { name: "Brand colour" })).toBeVisible();
  await screen.getByRole("radio", { name: "Violet" }).click();
  const stored = localStorage.getItem("fluent-enterprise-ui:theme-settings");
  expect(stored).toContain("violet");
});
