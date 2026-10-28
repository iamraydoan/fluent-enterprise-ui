import {
  Menu as FluentMenu,
  MenuDivider as FluentMenuDivider,
  MenuItem as FluentMenuItem,
  MenuItemRadio as FluentMenuItemRadio,
  MenuList as FluentMenuList,
  MenuPopover as FluentMenuPopover,
  MenuTrigger as FluentMenuTrigger,
} from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentProps, ComponentRef } from "react";

export type MenuProps = ComponentProps<typeof FluentMenu>;

export function Menu(props: MenuProps) {
  return <FluentMenu {...props} />;
}

export type MenuTriggerProps = ComponentProps<typeof FluentMenuTrigger>;

export function MenuTrigger(props: MenuTriggerProps) {
  return <FluentMenuTrigger {...props} />;
}

export type MenuPopoverProps = ComponentProps<typeof FluentMenuPopover>;

export const MenuPopover = forwardRef<ComponentRef<typeof FluentMenuPopover>, MenuPopoverProps>(
  function MenuPopover(props, ref) {
    return <FluentMenuPopover ref={ref} {...props} />;
  },
);

export type MenuListProps = ComponentProps<typeof FluentMenuList>;

export const MenuList = forwardRef<ComponentRef<typeof FluentMenuList>, MenuListProps>(
  function MenuList(props, ref) {
    return <FluentMenuList ref={ref} {...props} />;
  },
);

export type MenuItemProps = ComponentProps<typeof FluentMenuItem>;

export const MenuItem = forwardRef<ComponentRef<typeof FluentMenuItem>, MenuItemProps>(
  function MenuItem(props, ref) {
    return <FluentMenuItem ref={ref} {...props} />;
  },
);

export type MenuItemRadioProps = ComponentProps<typeof FluentMenuItemRadio>;

export const MenuItemRadio = forwardRef<
  ComponentRef<typeof FluentMenuItemRadio>,
  MenuItemRadioProps
>(function MenuItemRadio(props, ref) {
  return <FluentMenuItemRadio ref={ref} {...props} />;
});

export type MenuDividerProps = ComponentProps<typeof FluentMenuDivider>;

export const MenuDivider = forwardRef<ComponentRef<typeof FluentMenuDivider>, MenuDividerProps>(
  function MenuDivider(props, ref) {
    return <FluentMenuDivider ref={ref} {...props} />;
  },
);
