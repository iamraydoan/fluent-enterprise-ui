import {
  Popover as FluentPopover,
  PopoverSurface as FluentPopoverSurface,
  PopoverTrigger as FluentPopoverTrigger,
} from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentProps, ComponentRef } from "react";

export type PopoverProps = ComponentProps<typeof FluentPopover>;

export function Popover(props: PopoverProps) {
  return <FluentPopover {...props} />;
}

export type PopoverTriggerProps = ComponentProps<typeof FluentPopoverTrigger>;

export function PopoverTrigger(props: PopoverTriggerProps) {
  return <FluentPopoverTrigger {...props} />;
}

export type PopoverSurfaceProps = ComponentProps<typeof FluentPopoverSurface>;

export const PopoverSurface = forwardRef<
  ComponentRef<typeof FluentPopoverSurface>,
  PopoverSurfaceProps
>(function PopoverSurface(props, ref) {
  return <FluentPopoverSurface ref={ref} {...props} />;
});
