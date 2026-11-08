import type { ReactNode } from "react";
import { render } from "vitest-browser-react";
import { FluentProvider } from "@/components/ui";
import { initI18n } from "@/i18n";
import { lightTheme } from "@/theme";

export async function renderWithAppTheme(ui: ReactNode) {
  localStorage.setItem("fluent-enterprise-ui:language", "en");
  await initI18n();
  return await render(<FluentProvider theme={lightTheme}>{ui}</FluentProvider>);
}
