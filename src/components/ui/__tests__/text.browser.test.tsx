import type { ReactNode } from "react";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { FluentProvider, Text, tokens } from "@/components/ui";

function renderUi(ui: ReactNode) {
  return render(<FluentProvider>{ui}</FluentProvider>);
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
      {TONES.map(([tone, value]) => (
        <div key={tone}>
          <Text tone={tone}>{"tone " + tone}</Text>
          <span data-testid={"ref-" + tone} style={{ color: value }} />
        </div>
      ))}
    </div>,
  );
  for (const [tone] of TONES) {
    const element = screen.getByText("tone " + tone).element();
    const reference = document.querySelector('[data-testid="ref-' + tone + '"]') as HTMLElement;
    expect(getComputedStyle(element).color).toBe(getComputedStyle(reference).color);
  }
});

test("leaves the tone unset by default", async () => {
  const screen = await renderUi(
    <div>
      <Text>default tone</Text>
      <span data-testid="brand-ref" style={{ color: tokens.colorBrandForeground1 }} />
    </div>,
  );
  await expect.element(screen.getByText("default tone")).toBeVisible();
  const element = screen.getByText("default tone").element();
  const reference = document.querySelector('[data-testid="brand-ref"]') as HTMLElement;
  expect(getComputedStyle(element).color).not.toBe(getComputedStyle(reference).color);
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
