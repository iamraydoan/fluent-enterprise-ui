import {
  MenuDivider as FluentMenuDivider,
  MenuItem as FluentMenuItem,
  MenuList as FluentMenuList,
  MessageBar as FluentMessageBar,
  MessageBarBody as FluentMessageBarBody,
} from "@fluentui/react-components";
import type { ReactNode } from "react";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  FluentProvider,
  Menu,
  MenuDivider,
  MenuItem,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MessageBar,
  MessageBarBody,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Tooltip,
} from "@/components/ui";

function renderUi(ui: ReactNode) {
  return render(<FluentProvider>{ui}</FluentProvider>);
}

function classNameOf(selector: string) {
  return document.querySelector(selector)?.className;
}

test("Menu opens from its trigger and reports item clicks and radio selection", async () => {
  const onItemClick = vi.fn();
  const onCheckedValueChange = vi.fn();
  const screen = await renderUi(
    <Menu onCheckedValueChange={onCheckedValueChange}>
      <MenuTrigger disableButtonEnhancement>
        <Button aria-label="Open menu">Open</Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem onClick={onItemClick}>Alpha</MenuItem>
          <MenuDivider />
          <MenuItemRadio name="choice" value="one">
            One
          </MenuItemRadio>
          <MenuItemRadio name="choice" value="two">
            Two
          </MenuItemRadio>
        </MenuList>
      </MenuPopover>
    </Menu>,
  );
  const trigger = screen.getByRole("button", { name: "Open menu" });
  await trigger.click();
  await expect.element(screen.getByRole("menu")).toBeVisible();
  await screen.getByRole("menuitem", { name: "Alpha" }).click();
  expect(onItemClick).toHaveBeenCalledTimes(1);
  await trigger.click();
  await expect.element(screen.getByRole("menuitemradio", { name: "One" })).toBeVisible();
  await screen.getByRole("menuitemradio", { name: "One" }).click();
  expect(onCheckedValueChange).toHaveBeenCalledWith(["one"]);
});

test("MenuList reports checked values through its own callback", async () => {
  const onCheckedValueChange = vi.fn();
  const screen = await renderUi(
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button aria-label="Open list menu">Open</Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList onCheckedValueChange={onCheckedValueChange}>
          <MenuItemRadio name="size" value="small">
            Small
          </MenuItemRadio>
          <MenuItemRadio name="size" value="large">
            Large
          </MenuItemRadio>
        </MenuList>
      </MenuPopover>
    </Menu>,
  );
  await screen.getByRole("button", { name: "Open list menu" }).click();
  await expect.element(screen.getByRole("menuitemradio", { name: "Large" })).toBeVisible();
  await screen.getByRole("menuitemradio", { name: "Large" }).click();
  expect(onCheckedValueChange).toHaveBeenCalledWith(["large"]);
});

test("MenuDivider matches the Fluent divider markup", async () => {
  await renderUi(
    <div>
      <div data-testid="wrapper-divider">
        <MenuDivider />
      </div>
      <div data-testid="fluent-divider">
        <FluentMenuDivider />
      </div>
      <div data-testid="wrapper-list">
        <MenuList aria-label="Wrapper list">
          <MenuItem>Item</MenuItem>
        </MenuList>
      </div>
      <div data-testid="fluent-list">
        <FluentMenuList aria-label="Wrapper list">
          <FluentMenuItem>Item</FluentMenuItem>
        </FluentMenuList>
      </div>
    </div>,
  );
  const wrapperDivider = document.querySelector('[data-testid="wrapper-divider"] > div');
  const fluentDivider = document.querySelector('[data-testid="fluent-divider"] > div');
  expect(wrapperDivider?.outerHTML).toBe(fluentDivider?.outerHTML);
  const wrapperList = document.querySelector('[data-testid="wrapper-list"] > div');
  const fluentList = document.querySelector('[data-testid="fluent-list"] > div');
  expect(wrapperList?.outerHTML).toBe(fluentList?.outerHTML);
});

test("Popover opens and closes through its trigger", async () => {
  const onOpenChange = vi.fn();
  const screen = await renderUi(
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger disableButtonEnhancement>
        <Button>Show popover</Button>
      </PopoverTrigger>
      <PopoverSurface>Popover body</PopoverSurface>
    </Popover>,
  );
  const trigger = screen.getByRole("button", { name: "Show popover" });
  await trigger.click();
  await expect.element(screen.getByText("Popover body")).toBeVisible();
  expect(onOpenChange).toHaveBeenCalledWith(true);
  await trigger.click();
  expect(onOpenChange).toHaveBeenCalledWith(false);
});

test("Tooltip describes its trigger and shows its content on hover", async () => {
  const screen = await renderUi(
    <Tooltip content="Tip text" relationship="description">
      <Button>Hover me</Button>
    </Tooltip>,
  );
  const trigger = screen.getByRole("button", { name: "Hover me" });
  expect(trigger.element().getAttribute("aria-describedby")).toBeTruthy();
  await trigger.hover();
  await expect.element(screen.getByRole("tooltip", { name: "Tip text" })).toBeVisible();
  await expect.element(trigger).toHaveAccessibleDescription("Tip text");
});

test("Dialog opens from its trigger and closes through its close button", async () => {
  const onOpenChange = vi.fn();
  const screen = await renderUi(
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger disableButtonEnhancement>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogContent>Dialog content</DialogContent>
          <DialogActions>
            <Button>Confirm</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>,
  );
  await screen.getByRole("button", { name: "Open dialog" }).click();
  await expect.element(screen.getByRole("dialog")).toBeVisible();
  await expect.element(screen.getByText("Dialog title")).toBeVisible();
  await expect.element(screen.getByText("Dialog content")).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Confirm" })).toBeVisible();
  expect(onOpenChange).toHaveBeenCalledWith(true);
  const dialog = screen.getByRole("dialog").element();
  dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await vi.waitFor(() => {
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

test("MessageBar renders intent-specific markup and its body", async () => {
  const screen = await renderUi(
    <div>
      <div data-testid="error-wrapper">
        <MessageBar intent="error">
          <MessageBarBody>Wrapped error body</MessageBarBody>
        </MessageBar>
      </div>
      <div data-testid="error-fluent">
        <FluentMessageBar intent="error">
          <FluentMessageBarBody>Fluent error body</FluentMessageBarBody>
        </FluentMessageBar>
      </div>
      <div data-testid="default-wrapper">
        <MessageBar>
          <MessageBarBody>Wrapped default body</MessageBarBody>
        </MessageBar>
      </div>
      <div data-testid="info-fluent">
        <FluentMessageBar intent="info">
          <FluentMessageBarBody>Fluent info body</FluentMessageBarBody>
        </FluentMessageBar>
      </div>
    </div>,
  );
  await expect.element(screen.getByText("Wrapped default body")).toBeVisible();
  expect(document.querySelector('[data-testid="error-wrapper"] [role="group"]')).not.toBeNull();
  expect(classNameOf('[data-testid="error-wrapper"] [role="group"]')).toBe(
    classNameOf('[data-testid="error-fluent"] [role="group"]'),
  );
  expect(classNameOf('[data-testid="default-wrapper"] [role="group"]')).toBe(
    classNameOf('[data-testid="info-fluent"] [role="group"]'),
  );
});
