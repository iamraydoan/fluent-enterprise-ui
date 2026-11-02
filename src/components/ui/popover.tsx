import {
  Popover as FluentPopover,
  PopoverSurface as FluentPopoverSurface,
  PopoverTrigger as FluentPopoverTrigger,
} from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentRef, CSSProperties, ReactElement, ReactNode } from "react";

export type PopoverPositioning = "above" | "below" | "before" | "after" | "below-end" | "above-end";

export interface PopoverProps {
  positioning?: PopoverPositioning;
  withArrow?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export function Popover({ onOpenChange, children, ...rest }: PopoverProps) {
  return (
    <FluentPopover
      onOpenChange={onOpenChange ? (_, data) => onOpenChange(data.open) : undefined}
      {...rest}
    >
      {children as ReactElement}
    </FluentPopover>
  );
}

export interface PopoverTriggerProps {
  disableButtonEnhancement?: boolean;
  children?: ReactNode;
}

export function PopoverTrigger({ children, ...rest }: PopoverTriggerProps) {
  return <FluentPopoverTrigger {...rest}>{children as ReactElement}</FluentPopoverTrigger>;
}

export interface PopoverSurfaceProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const PopoverSurface = forwardRef<
  ComponentRef<typeof FluentPopoverSurface>,
  PopoverSurfaceProps
>(function PopoverSurface(props, ref) {
  return <FluentPopoverSurface ref={ref} {...props} />;
});
