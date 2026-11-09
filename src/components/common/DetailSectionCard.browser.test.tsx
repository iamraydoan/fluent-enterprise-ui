import { expect, test } from "vitest";
import { DetailSectionCard } from "@/components/common";
import { css, renderWithAppTheme } from "@/test-utils";

function cardOf(label: string) {
  const heading = Array.from(document.querySelectorAll("span")).find(
    (span) => span.textContent === label,
  ) as HTMLElement;
  return heading.parentElement as HTMLElement;
}

test("renders a padded content card with a heading", async () => {
  const screen = await renderWithAppTheme(
    <DetailSectionCard title="General Data">
      <span>body</span>
    </DetailSectionCard>,
  );
  await expect.element(screen.getByText("General Data")).toBeVisible();
  const card = cardOf("General Data");
  expect(css(card, "padding")).toBe("14px 16px");
  expect(css(card, "background-color")).toBe("rgb(250, 250, 250)");
  expect(css(card, "border-radius")).toBe("12px");
  expect(css(card, "display")).toBe("flex");
  expect(css(card, "flex-direction")).toBe("column");
  expect(css(card, "row-gap")).toBe("normal");
  expect(css(card, "margin-top")).toBe("10px");
});

test("styles the heading above the body", async () => {
  const screen = await renderWithAppTheme(
    <DetailSectionCard title="General Data">
      <span>body</span>
    </DetailSectionCard>,
  );
  await expect.element(screen.getByText("General Data")).toBeVisible();
  const heading = cardOf("General Data").children[0] as HTMLElement;
  expect(css(heading, "font-size")).toBe("16px");
  expect(css(heading, "font-weight")).toBe("600");
  expect(css(heading, "margin-bottom")).toBe("8px");
  expect(heading.nextElementSibling?.textContent).toBe("body");
});
