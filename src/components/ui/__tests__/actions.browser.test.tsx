import { Button as FluentButton } from "@fluentui/react-components";
import { createRef } from "react";
import type { ReactNode } from "react";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
  Badge,
  Body1Strong,
  Button,
  Caption1,
  Divider,
  FluentProvider,
  Spinner,
  Text,
} from "@/components/ui";

function renderUi(ui: ReactNode) {
  return render(<FluentProvider>{ui}</FluentProvider>);
}

function buttonClasses() {
  const classes = new Map<string, string>();
  for (const button of Array.from(document.querySelectorAll("button"))) {
    const label = button.textContent?.trim() ?? "";
    if (label) classes.set(label, button.className);
  }
  return classes;
}

test("Button renders its children and forwards clicks", async () => {
  const onClick = vi.fn();
  const screen = await renderUi(<Button onClick={onClick}>Save</Button>);
  const button = screen.getByRole("button", { name: "Save" });
  await expect.element(button).toBeEnabled();
  await button.click();
  expect(onClick).toHaveBeenCalledTimes(1);
});

test("Button size maps to the Fluent size scale", async () => {
  await renderUi(
    <div>
      <Button size="sm">wrapper-sm</Button>
      <Button size="md">wrapper-md</Button>
      <Button size="lg">wrapper-lg</Button>
      <FluentButton size="small">fluent-sm</FluentButton>
      <FluentButton size="medium">fluent-md</FluentButton>
      <FluentButton size="large">fluent-lg</FluentButton>
    </div>,
  );
  const classes = buttonClasses();
  expect(classes.size).toBe(6);
  expect(classes.get("wrapper-sm")).toBe(classes.get("fluent-sm"));
  expect(classes.get("wrapper-md")).toBe(classes.get("fluent-md"));
  expect(classes.get("wrapper-lg")).toBe(classes.get("fluent-lg"));
  expect(
    new Set([classes.get("wrapper-sm"), classes.get("wrapper-md"), classes.get("wrapper-lg")]).size,
  ).toBe(3);
});

test("Button variant maps to the Fluent appearance", async () => {
  const variants = ["primary", "secondary", "subtle", "transparent", "outline"] as const;
  await renderUi(
    <div>
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          {"wrapper-" + variant}
        </Button>
      ))}
      {variants.map((variant) => (
        <FluentButton key={variant} appearance={variant}>
          {"fluent-" + variant}
        </FluentButton>
      ))}
    </div>,
  );
  const classes = buttonClasses();
  for (const variant of variants) {
    expect(classes.get("wrapper-" + variant)).toBe(classes.get("fluent-" + variant));
  }
});

test("Button disabled state is exposed and blocks activation", async () => {
  const onClick = vi.fn();
  const screen = await renderUi(
    <Button disabled onClick={onClick}>
      Nope
    </Button>,
  );
  const button = screen.getByRole("button", { name: "Nope" });
  await expect.element(button).toBeDisabled();
  expect(onClick).not.toHaveBeenCalled();
});

test("Button forwards its ref to the underlying button element", async () => {
  const ref = createRef<HTMLButtonElement | HTMLAnchorElement>();
  await renderUi(<Button ref={ref}>Ref button</Button>);
  expect(ref.current?.tagName).toBe("BUTTON");
  expect(ref.current).toBe(document.querySelector("button"));
});

test("Button renders an icon next to its label", async () => {
  const screen = await renderUi(
    <Button icon={<span aria-hidden="true" data-icon="probe" />}>Icon label</Button>,
  );
  await expect.element(screen.getByRole("button", { name: "Icon label" })).toBeVisible();
  expect(document.querySelector('[data-icon="probe"]')).not.toBeNull();
});

test("Badge renders its content", async () => {
  const screen = await renderUi(<Badge>Live</Badge>);
  await expect.element(screen.getByText("Live")).toBeVisible();
});

test("Divider exposes the separator role", async () => {
  const screen = await renderUi(<Divider />);
  await expect.element(screen.getByRole("separator")).toBeVisible();
});

test("Spinner exposes the progressbar role with its label", async () => {
  const screen = await renderUi(<Spinner label="Loading" />);
  await expect.element(screen.getByRole("progressbar", { name: "Loading" })).toBeVisible();
});

test("Text, Body1Strong and Caption1 render their content", async () => {
  const screen = await renderUi(
    <div>
      <Text>Body copy</Text>
      <Body1Strong>Strong copy</Body1Strong>
      <Caption1>Caption copy</Caption1>
    </div>,
  );
  await expect.element(screen.getByText("Body copy")).toBeVisible();
  await expect.element(screen.getByText("Strong copy")).toBeVisible();
  await expect.element(screen.getByText("Caption copy")).toBeVisible();
});
