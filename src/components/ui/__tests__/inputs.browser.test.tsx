import { Field as FluentField, Input as FluentInput } from "@fluentui/react-components";
import type { ReactNode } from "react";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
  Checkbox,
  Combobox,
  Dropdown,
  Field,
  FluentProvider,
  Input,
  Option,
  Radio,
  RadioGroup,
  Switch,
  Textarea,
} from "@/components/ui";

function renderUi(ui: ReactNode) {
  return render(<FluentProvider>{ui}</FluentProvider>);
}

function innerHtmlOf(testId: string) {
  return document.querySelector('[data-testid="' + testId + '"]')?.innerHTML;
}

test("Input reports its string value through onChange", async () => {
  const onChange = vi.fn();
  const screen = await renderUi(<Input placeholder="Name" onChange={onChange} />);
  await screen.getByPlaceholder("Name").fill("Ada");
  expect(onChange).toHaveBeenLastCalledWith("Ada");
});

test("Input exposes its placeholder and disabled state", async () => {
  const screen = await renderUi(<Input placeholder="Locked" disabled />);
  const input = screen.getByPlaceholder("Locked");
  await expect.element(input).toBeVisible();
  await expect.element(input).toBeDisabled();
  await expect.element(input).toHaveAttribute("placeholder", "Locked");
});

test("Input size and variant map onto the Fluent input", async () => {
  await renderUi(
    <div>
      <div data-testid="wrapper-sm">
        <Input size="sm" variant="outline" placeholder="small" />
      </div>
      <div data-testid="wrapper-lg">
        <Input size="lg" variant="filled" placeholder="large" />
      </div>
      <div data-testid="fluent-sm">
        <FluentInput size="small" appearance="outline" placeholder="small" />
      </div>
      <div data-testid="fluent-lg">
        <FluentInput size="large" appearance="filled-darker" placeholder="large" />
      </div>
    </div>,
  );
  expect(innerHtmlOf("wrapper-sm")).toBe(innerHtmlOf("fluent-sm"));
  expect(innerHtmlOf("wrapper-lg")).toBe(innerHtmlOf("fluent-lg"));
  expect(innerHtmlOf("wrapper-sm")).not.toBe(innerHtmlOf("wrapper-lg"));
});

test("Textarea reports its value through onChange", async () => {
  const onChange = vi.fn();
  const screen = await renderUi(<Textarea placeholder="Notes" onChange={onChange} />);
  await screen.getByPlaceholder("Notes").fill("Line one");
  expect(onChange).toHaveBeenLastCalledWith("Line one");
});

test("Field renders a label bound to its control and maps its size", async () => {
  const screen = await renderUi(
    <div>
      <div data-testid="field-wrapper">
        <Field label="Field label" size="sm">
          <Input />
        </Field>
      </div>
      <div data-testid="field-fluent">
        <FluentField label="Reference label" size="small">
          <FluentInput />
        </FluentField>
      </div>
    </div>,
  );
  await expect.element(screen.getByText("Field label")).toBeVisible();
  const wrapperLabel = document.querySelector('[data-testid="field-wrapper"] label');
  const wrapperControl = document.querySelector('[data-testid="field-wrapper"] input');
  expect(wrapperLabel?.getAttribute("for")).toBe(wrapperControl?.id);
  const wrapperField = document.querySelector('[data-testid="field-wrapper"] > div');
  const fluentField = document.querySelector('[data-testid="field-fluent"] > div');
  expect(wrapperField?.className).toBe(fluentField?.className);
});

test("Checkbox reports its checked state through onChange", async () => {
  const onChange = vi.fn();
  const screen = await renderUi(<Checkbox label="Accept terms" onChange={onChange} />);
  const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
  await checkbox.click();
  expect(onChange).toHaveBeenLastCalledWith(true);
  await expect.element(checkbox).toBeChecked();
});

test("Checkbox can be disabled", async () => {
  const screen = await renderUi(<Checkbox label="Disabled box" disabled />);
  await expect.element(screen.getByRole("checkbox", { name: "Disabled box" })).toBeDisabled();
});

test("Switch reports its checked state through onChange", async () => {
  const onChange = vi.fn();
  const screen = await renderUi(<Switch label="Enable alerts" onChange={onChange} />);
  const toggle = screen.getByRole("switch", { name: "Enable alerts" });
  await toggle.click();
  expect(onChange).toHaveBeenLastCalledWith(true);
  await expect.element(toggle).toBeChecked();
});

test("RadioGroup reports the selected radio value", async () => {
  const onChange = vi.fn();
  const screen = await renderUi(
    <RadioGroup aria-label="Priority" onChange={onChange}>
      <Radio value="low" label="Low" />
      <Radio value="high" label="High" />
    </RadioGroup>,
  );
  const high = screen.getByRole("radio", { name: "High" });
  await high.click();
  expect(onChange).toHaveBeenLastCalledWith("high");
  await expect.element(high).toBeChecked();
});

test("Dropdown reports the selected option value", async () => {
  const onOptionSelect = vi.fn();
  const screen = await renderUi(
    <Dropdown aria-label="Color" onOptionSelect={onOptionSelect}>
      <Option value="red" text="Red">
        Red
      </Option>
      <Option value="blue" text="Blue">
        Blue
      </Option>
    </Dropdown>,
  );
  await screen.getByRole("combobox", { name: "Color" }).click();
  await expect.element(screen.getByRole("option", { name: "Blue" })).toBeVisible();
  await screen.getByRole("option", { name: "Blue" }).click();
  expect(onOptionSelect).toHaveBeenLastCalledWith("blue");
});

test("Combobox reports text changes, open state and selection", async () => {
  const onTextChange = vi.fn();
  const onOpenChange = vi.fn();
  const onOptionSelect = vi.fn();
  const screen = await renderUi(
    <Combobox
      aria-label="Fruit"
      onTextChange={onTextChange}
      onOpenChange={onOpenChange}
      onOptionSelect={onOptionSelect}
    >
      <Option value="apple" text="Apple">
        Apple
      </Option>
      <Option value="pear" text="Pear">
        Pear
      </Option>
    </Combobox>,
  );
  const combobox = screen.getByRole("combobox", { name: "Fruit" });
  await combobox.fill("Pe");
  expect(onTextChange).toHaveBeenLastCalledWith("Pe");
  await combobox.click();
  await expect.element(screen.getByRole("option", { name: "Pear" })).toBeVisible();
  expect(onOpenChange).toHaveBeenCalledWith(true);
  await screen.getByRole("option", { name: "Pear" }).click();
  expect(onOptionSelect).toHaveBeenLastCalledWith("pear");
});
