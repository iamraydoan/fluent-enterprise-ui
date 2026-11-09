import type { ReactNode } from "react";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { FluentProvider, Input } from "@/components/ui";

function renderUi(ui: ReactNode) {
  return render(<FluentProvider>{ui}</FluentProvider>);
}

function widthCarrier(label: string) {
  let element: HTMLElement | null = document.querySelector('[aria-label="' + label + '"]');
  while (element && element !== document.body && element.style.width === "") {
    element = element.parentElement;
  }
  return element === document.body ? null : element;
}

test("applies a numeric width and a string width to the input", async () => {
  const screen = await renderUi(
    <div>
      <Input aria-label="numeric" width={160} />
      <Input aria-label="string" width="200px" />
      <Input aria-label="plain" />
    </div>,
  );
  await expect.element(screen.getByLabelText("numeric")).toBeVisible();
  expect(widthCarrier("numeric")?.style.width).toBe("160px");
  expect(widthCarrier("string")?.style.width).toBe("200px");
  expect(widthCarrier("plain")).toBeNull();
});
