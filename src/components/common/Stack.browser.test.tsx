import { expect, test } from "vitest";
import { Grid, HStack, VStack } from "@/components/common";
import { theme } from "@/styles/theme";
import { css, renderWithAppTheme } from "@/test-utils";

function gridElement() {
  return document.querySelector('[style*="grid-template-columns"]') as HTMLElement;
}

test("applies a theme-backed bottom margin", async () => {
  await renderWithAppTheme(
    <HStack mb="md">
      <span>row</span>
    </HStack>,
  );
  const row = document.querySelector('[style*="margin-bottom"]') as HTMLElement;
  expect(row.style.marginBottom).toBe("var(--spacingHorizontalM)");
});

test("expands the auto-fit preset with the default minimum column", async () => {
  await renderWithAppTheme(
    <Grid columns="auto-fit" gap="md">
      <span>tile</span>
    </Grid>,
  );
  const grid = gridElement();
  expect(grid.style.gridTemplateColumns).toBe("repeat(auto-fit, minmax(300px, 1fr))");
  expect(grid.style.gap).toBe("var(--spacingHorizontalM)");
});

test("expands the auto-fit preset with an explicit minimum column", async () => {
  await renderWithAppTheme(
    <Grid columns="auto-fit" minColumn={340}>
      <span>tile</span>
    </Grid>,
  );
  expect(gridElement().style.gridTemplateColumns).toBe("repeat(auto-fit, minmax(340px, 1fr))");
});

test("expands the auto-fill preset with an explicit minimum column", async () => {
  await renderWithAppTheme(
    <Grid columns="auto-fill" minColumn={90} gap="sm">
      <span>tile</span>
    </Grid>,
  );
  expect(gridElement().style.gridTemplateColumns).toBe("repeat(auto-fill, minmax(90px, 1fr))");
});

test("expands the aside-main preset from its minimum width", async () => {
  await renderWithAppTheme(
    <Grid columns="aside-main" asideWidth={320} gap="md">
      <span>aside</span>
      <span>main</span>
    </Grid>,
  );
  expect(gridElement().style.gridTemplateColumns).toBe("minmax(320px, 2fr) 3fr");
});

test("expands the main-aside preset with the default widths", async () => {
  await renderWithAppTheme(
    <Grid columns="main-aside" gap="md">
      <span>main</span>
      <span>aside</span>
    </Grid>,
  );
  expect(gridElement().style.gridTemplateColumns).toBe("3fr minmax(280px, 1fr)");
});

test("expands the main-aside preset with explicit widths", async () => {
  await renderWithAppTheme(
    <Grid columns="main-aside" mainFr={2} asideWidth={320} gap="md">
      <span>main</span>
      <span>aside</span>
    </Grid>,
  );
  expect(gridElement().style.gridTemplateColumns).toBe("2fr minmax(320px, 1fr)");
});

test("applies a theme-backed padding", async () => {
  await renderWithAppTheme(
    <Grid columns="auto-fit" gap="md" p="lg">
      <span>tile</span>
    </Grid>,
  );
  expect(gridElement().style.padding).toBe("var(--spacingHorizontalL)");
});

test("passes an explicit template through unchanged", async () => {
  await renderWithAppTheme(
    <Grid columns="repeat(2, minmax(0, 1fr))" gap="12px">
      <span>tile</span>
    </Grid>,
  );
  const grid = gridElement();
  expect(grid.style.gridTemplateColumns).toBe("repeat(2, minmax(0px, 1fr))");
  expect(grid.style.gap).toBe("12px");
});

test("applies minimum sizes to a stack", async () => {
  const screen = await renderWithAppTheme(
    <VStack minWidth={0} minHeight={0}>
      <span>sized row</span>
    </VStack>,
  );
  const stack = screen.getByText("sized row").element().parentElement as HTMLElement;
  expect(stack.style.minWidth).toBe("0px");
  expect(stack.style.minHeight).toBe("0px");
});

test("lays a stack out inline", async () => {
  const screen = await renderWithAppTheme(
    <HStack inline align="center" gap={6}>
      <span>inline row</span>
    </HStack>,
  );
  const stack = screen.getByText("inline row").element().parentElement as HTMLElement;
  expect(css(stack, "display")).toBe("inline-flex");
  expect(css(stack, "align-items")).toBe("center");
  expect(css(stack, "column-gap")).toBe("6px");
});

test("applies a top margin from a scale name and a number", async () => {
  const scale = await renderWithAppTheme(
    <VStack mt="md" gap="none">
      <span>scale top</span>
    </VStack>,
  );
  await expect.element(scale.getByText("scale top")).toBeVisible();
  expect(
    css(scale.getByText("scale top").element().parentElement as HTMLElement, "margin-top"),
  ).toBe("12px");

  const numeric = await renderWithAppTheme(
    <VStack mt={12} gap="none">
      <span>numeric top</span>
    </VStack>,
  );
  await expect.element(numeric.getByText("numeric top")).toBeVisible();
  expect(
    css(numeric.getByText("numeric top").element().parentElement as HTMLElement, "margin-top"),
  ).toBe("12px");
});

function parentStack(screen: Awaited<ReturnType<typeof renderWithAppTheme>>, text: string) {
  return screen.getByText(text).element().parentElement as HTMLElement;
}

function tokenValue(token: string, property: string) {
  const root = document.querySelector(".fui-FluentProvider") as HTMLElement;
  const probe = document.createElement("div");
  const plain = document.createElement("div");
  root.append(probe, plain);
  probe.setAttribute("style", property + ": " + token);
  const expected = getComputedStyle(probe).getPropertyValue(property);
  const fallback = getComputedStyle(plain).getPropertyValue(property);
  probe.remove();
  plain.remove();
  expect(expected).not.toBe(fallback);
  return expected;
}

test("opts a stack out of shrinking and leaves the default alone", async () => {
  const screen = await renderWithAppTheme(
    <HStack shrink>
      <span>shrunk row</span>
    </HStack>,
  );
  await expect.element(screen.getByText("shrunk row")).toBeVisible();
  expect(css(parentStack(screen, "shrunk row"), "flex-shrink")).toBe("0");

  const control = await renderWithAppTheme(
    <HStack>
      <span>default row</span>
    </HStack>,
  );
  await expect.element(control.getByText("default row")).toBeVisible();
  expect(css(parentStack(control, "default row"), "flex-shrink")).toBe("1");
});

test("applies intrinsic sizing and a maximum width", async () => {
  const screen = await renderWithAppTheme(
    <VStack width={268} height="100%" maxWidth={820}>
      <span>sized stack</span>
    </VStack>,
  );
  await expect.element(screen.getByText("sized stack")).toBeVisible();
  const sized = parentStack(screen, "sized stack");
  expect(sized.style.width).toBe("268px");
  expect(sized.style.height).toBe("100%");
  expect(sized.style.maxWidth).toBe("820px");

  const control = await renderWithAppTheme(
    <VStack>
      <span>unsized stack</span>
    </VStack>,
  );
  await expect.element(control.getByText("unsized stack")).toBeVisible();
  const unsized = parentStack(control, "unsized stack");
  expect(unsized.style.width).toBe("");
  expect(unsized.style.height).toBe("");
  expect(unsized.style.maxWidth).toBe("");
});

test("places a stack on its own cross axis", async () => {
  const screen = await renderWithAppTheme(
    <HStack alignSelf="end">
      <span>self aligned</span>
    </HStack>,
  );
  await expect.element(screen.getByText("self aligned")).toBeVisible();
  expect(css(parentStack(screen, "self aligned"), "align-self")).toBe("flex-end");

  const control = await renderWithAppTheme(
    <HStack>
      <span>default aligned</span>
    </HStack>,
  );
  await expect.element(control.getByText("default aligned")).toBeVisible();
  expect(css(parentStack(control, "default aligned"), "align-self")).toBe("auto");
});

test("paints a theme tone, a full border and a theme radius, and nothing when absent", async () => {
  const screen = await renderWithAppTheme(
    <VStack tone="surfaceTertiary" border radius="md">
      <span>painted stack</span>
    </VStack>,
  );
  await expect.element(screen.getByText("painted stack")).toBeVisible();
  const expectedTone = tokenValue(theme.color.surfaceTertiary, "background-color");
  const expectedBorder = tokenValue(theme.color.borderSubtle, "border-top-color");
  const painted = parentStack(screen, "painted stack");
  expect(css(painted, "background-color")).toBe(expectedTone);
  expect(css(painted, "border-top-width")).toBe("1px");
  expect(css(painted, "border-top-style")).toBe("solid");
  expect(css(painted, "border-top-color")).toBe(expectedBorder);
  expect(css(painted, "border-radius")).toBe("4px");

  const control = await renderWithAppTheme(
    <VStack>
      <span>plain stack</span>
    </VStack>,
  );
  await expect.element(control.getByText("plain stack")).toBeVisible();
  const plain = parentStack(control, "plain stack");
  expect(css(plain, "background-color")).toBe("rgba(0, 0, 0, 0)");
  expect(css(plain, "border-top-width")).toBe("0px");
  expect(css(plain, "border-radius")).toBe("0px");
});

test("adds and omits single theme border sides", async () => {
  const screen = await renderWithAppTheme(
    <VStack>
      <VStack borderSide="bottom">
        <span>side child</span>
      </VStack>
      <VStack border borderOmit="bottom">
        <span>omit child</span>
      </VStack>
    </VStack>,
  );
  await expect.element(screen.getByText("side child")).toBeVisible();
  const side = parentStack(screen, "side child");
  expect(css(side, "border-bottom-width")).toBe("1px");
  expect(css(side, "border-bottom-style")).toBe("solid");
  expect(css(side, "border-top-width")).toBe("0px");
  expect(css(side, "border-left-width")).toBe("0px");

  await expect.element(screen.getByText("omit child")).toBeVisible();
  const omit = parentStack(screen, "omit child");
  expect(css(omit, "border-top-width")).toBe("1px");
  expect(css(omit, "border-bottom-style")).toBe("none");
  expect(css(omit, "border-bottom-width")).toBe("0px");
});

test("clips overflow and leaves it visible when absent", async () => {
  const screen = await renderWithAppTheme(
    <VStack clip>
      <span>clipped stack</span>
    </VStack>,
  );
  await expect.element(screen.getByText("clipped stack")).toBeVisible();
  expect(css(parentStack(screen, "clipped stack"), "overflow")).toBe("hidden");

  const control = await renderWithAppTheme(
    <VStack>
      <span>open stack</span>
    </VStack>,
  );
  await expect.element(control.getByText("open stack")).toBeVisible();
  expect(css(parentStack(control, "open stack"), "overflow")).toBe("visible");
});

test("aligns text and preserves whitespace on the box host", async () => {
  const screen = await renderWithAppTheme(
    <VStack textAlign="center" whiteSpace="pre-wrap">
      <span>text child</span>
    </VStack>,
  );
  await expect.element(screen.getByText("text child")).toBeVisible();
  const aligned = parentStack(screen, "text child");
  expect(css(aligned, "text-align")).toBe("center");
  expect(css(aligned, "white-space")).toBe("pre-wrap");

  const control = await renderWithAppTheme(
    <VStack>
      <span>plain text</span>
    </VStack>,
  );
  await expect.element(control.getByText("plain text")).toBeVisible();
  const plain = parentStack(control, "plain text");
  expect(css(plain, "text-align")).not.toBe("center");
  expect(css(plain, "white-space")).toBe("normal");
});

test("applies padding per side while p still sets all four", async () => {
  const sides = await renderWithAppTheme(
    <VStack pl="lg" pr={12} pt={6} pb="sm">
      <span>padded stack</span>
    </VStack>,
  );
  await expect.element(sides.getByText("padded stack")).toBeVisible();
  const padded = parentStack(sides, "padded stack");
  expect(padded.style.paddingLeft).toBe("var(--spacingHorizontalL)");
  expect(padded.style.paddingRight).toBe("12px");
  expect(padded.style.paddingTop).toBe("6px");
  expect(padded.style.paddingBottom).toBe("var(--spacingHorizontalS)");

  const all = await renderWithAppTheme(
    <VStack p="md">
      <span>all sides</span>
    </VStack>,
  );
  await expect.element(all.getByText("all sides")).toBeVisible();
  expect(parentStack(all, "all sides").style.padding).toBe("var(--spacingHorizontalM)");

  const override = await renderWithAppTheme(
    <VStack p="md" px="lg">
      <span>px wins</span>
    </VStack>,
  );
  await expect.element(override.getByText("px wins")).toBeVisible();
  const overridden = parentStack(override, "px wins");
  expect(overridden.style.paddingLeft).toBe("var(--spacingHorizontalL)");
  expect(overridden.style.paddingRight).toBe("var(--spacingHorizontalL)");

  const control = await renderWithAppTheme(
    <VStack>
      <span>no padding</span>
    </VStack>,
  );
  await expect.element(control.getByText("no padding")).toBeVisible();
  expect(parentStack(control, "no padding").style.paddingLeft).toBe("");
});

test("applies margins per side and leaves the default alone", async () => {
  const screen = await renderWithAppTheme(
    <VStack ml={6} mr="sm" mb="md" mt={12}>
      <span>margined stack</span>
    </VStack>,
  );
  await expect.element(screen.getByText("margined stack")).toBeVisible();
  const margined = parentStack(screen, "margined stack");
  expect(margined.style.marginLeft).toBe("6px");
  expect(margined.style.marginRight).toBe("var(--spacingHorizontalS)");
  expect(margined.style.marginBottom).toBe("var(--spacingHorizontalM)");
  expect(margined.style.marginTop).toBe("12px");

  const control = await renderWithAppTheme(
    <VStack>
      <span>no margin</span>
    </VStack>,
  );
  await expect.element(control.getByText("no margin")).toBeVisible();
  const plain = parentStack(control, "no margin");
  expect(plain.style.marginLeft).toBe("");
  expect(plain.style.marginRight).toBe("");
});
