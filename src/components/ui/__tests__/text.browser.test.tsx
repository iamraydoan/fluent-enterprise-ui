import { webLightTheme } from "@fluentui/react-components";
import type { ReactNode } from "react";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { FluentProvider, Text, tokens } from "@/components/ui";

function renderUi(ui: ReactNode) {
  return render(<FluentProvider theme={webLightTheme}>{ui}</FluentProvider>);
}

function tokenColor(token: string) {
  const root = document.querySelector(".fui-FluentProvider") as HTMLElement;
  const probe = document.createElement("div");
  const plain = document.createElement("div");
  root.append(probe, plain);
  probe.setAttribute("style", "color: " + token);
  const expected = getComputedStyle(probe).color;
  const fallback = getComputedStyle(plain).color;
  probe.remove();
  plain.remove();
  return { expected, fallback };
}

const TONES = [
  ["primary", tokens.colorNeutralForeground1],
  ["secondary", tokens.colorNeutralForeground2],
  ["tertiary", tokens.colorNeutralForeground3],
  ["quaternary", tokens.colorNeutralForeground4],
  ["brand", tokens.colorBrandForeground1],
  ["danger", tokens.colorPaletteRedForeground1],
] as const;

test("maps every semantic tone to its token", async () => {
  const screen = await renderUi(
    <div>
      {TONES.map(([tone]) => (
        <div key={tone}>
          <Text tone={tone}>{"tone " + tone}</Text>
        </div>
      ))}
    </div>,
  );
  for (const [tone, value] of TONES) {
    const element = screen.getByText("tone " + tone).element();
    expect(getComputedStyle(element).color).toBe(tokenColor(value).expected);
  }
  const brand = tokenColor(tokens.colorBrandForeground1);
  expect(brand.expected).not.toBe(brand.fallback);
});

test("leaves the tone unset by default", async () => {
  const screen = await renderUi(<Text>default tone</Text>);
  await expect.element(screen.getByText("default tone")).toBeVisible();
  const element = screen.getByText("default tone").element();
  const brand = tokenColor(tokens.colorBrandForeground1);
  expect(brand.expected).not.toBe(brand.fallback);
  expect(getComputedStyle(element).color).not.toBe(brand.expected);
});

test("aligns text only when asked", async () => {
  const screen = await renderUi(
    <div>
      <Text align="center">centered text</Text>
      <Text>plain text</Text>
    </div>,
  );
  await expect.element(screen.getByText("centered text")).toBeVisible();
  expect(getComputedStyle(screen.getByText("centered text").element()).textAlign).toBe("center");
  expect(getComputedStyle(screen.getByText("plain text").element()).textAlign).not.toBe("center");
});
