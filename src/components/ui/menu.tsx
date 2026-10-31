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
import type { ComponentRef, CSSProperties, MouseEvent, ReactElement, ReactNode } from "react";

export type MenuPositioning =
  | "above"
  | "below"
  | "before"
  | "after"
  | "below-start"
  | "below-end"
  | "above-start"
  | "above-end";

export interface MenuProps {
  positioning?: MenuPositioning;
  checkedValues?: Record<string, string[]>;
  onCheckedValueChange?: (checkedItems: string[]) => void;
  children?: ReactNode;
}

export function Menu({ onCheckedValueChange, children, ...rest }: MenuProps) {
  return (
    <FluentMenu
      onCheckedValueChange={
        onCheckedValueChange ? (_, data) => onCheckedValueChange(data.checkedItems) : undefined
      }
      {...rest}
    >
      {children as ReactElement}
    </FluentMenu>
  );
}

export interface MenuTriggerProps {
  disableButtonEnhancement?: boolean;
  children?: ReactNode;
}

export function MenuTrigger({ children, ...rest }: MenuTriggerProps) {
  return <FluentMenuTrigger {...rest}>{children as ReactElement}</FluentMenuTrigger>;
}

export interface MenuPopoverProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const MenuPopover = forwardRef<ComponentRef<typeof FluentMenuPopover>, MenuPopoverProps>(
  function MenuPopover(props, ref) {
    return <FluentMenuPopover ref={ref} {...props} />;
  },
);

export interface MenuListProps {
  checkedValues?: Record<string, string[]>;
  onCheckedValueChange?: (checkedItems: string[]) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const MenuList = forwardRef<ComponentRef<typeof FluentMenuList>, MenuListProps>(
  function MenuList({ onCheckedValueChange, ...rest }, ref) {
    return (
      <FluentMenuList
        ref={ref}
        onCheckedValueChange={
          onCheckedValueChange ? (_, data) => onCheckedValueChange(data.checkedItems) : undefined
        }
        {...rest}
      />
    );
  },
);

export interface MenuItemProps {
  disabled?: boolean;
  icon?: ReactElement;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const MenuItem = forwardRef<ComponentRef<typeof FluentMenuItem>, MenuItemProps>(
  function MenuItem(props, ref) {
    return <FluentMenuItem ref={ref} {...props} />;
  },
);

export interface MenuItemRadioProps {
  name: string;
  value: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const MenuItemRadio = forwardRef<
  ComponentRef<typeof FluentMenuItemRadio>,
  MenuItemRadioProps
>(function MenuItemRadio(props, ref) {
  return <FluentMenuItemRadio ref={ref} {...props} />;
});

export interface MenuDividerProps {
  className?: string;
  style?: CSSProperties;
}

export const MenuDivider = forwardRef<ComponentRef<typeof FluentMenuDivider>, MenuDividerProps>(
  function MenuDivider(props, ref) {
    return <FluentMenuDivider ref={ref} {...props} />;
  },
);
