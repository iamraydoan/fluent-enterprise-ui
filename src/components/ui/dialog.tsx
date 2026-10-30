import {
  Dialog as FluentDialog,
  DialogActions as FluentDialogActions,
  DialogBody as FluentDialogBody,
  DialogContent as FluentDialogContent,
  DialogSurface as FluentDialogSurface,
  DialogTitle as FluentDialogTitle,
  DialogTrigger as FluentDialogTrigger,
} from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentProps, ComponentRef } from "react";

export type DialogProps = ComponentProps<typeof FluentDialog>;

export function Dialog(props: DialogProps) {
  return <FluentDialog {...props} />;
}

export type DialogTriggerProps = ComponentProps<typeof FluentDialogTrigger>;

export function DialogTrigger(props: DialogTriggerProps) {
  return <FluentDialogTrigger {...props} />;
}

export type DialogSurfaceProps = ComponentProps<typeof FluentDialogSurface>;

export const DialogSurface = forwardRef<
  ComponentRef<typeof FluentDialogSurface>,
  DialogSurfaceProps
>(function DialogSurface(props, ref) {
  return <FluentDialogSurface ref={ref} {...props} />;
});

export type DialogBodyProps = ComponentProps<typeof FluentDialogBody>;

export const DialogBody = forwardRef<ComponentRef<typeof FluentDialogBody>, DialogBodyProps>(
  function DialogBody(props, ref) {
    return <FluentDialogBody ref={ref} {...props} />;
  },
);

export type DialogTitleProps = ComponentProps<typeof FluentDialogTitle>;

export function DialogTitle(props: DialogTitleProps) {
  return <FluentDialogTitle {...props} />;
}

export type DialogContentProps = ComponentProps<typeof FluentDialogContent>;

export function DialogContent(props: DialogContentProps) {
  return <FluentDialogContent {...props} />;
}

export type DialogActionsProps = ComponentProps<typeof FluentDialogActions>;

export function DialogActions(props: DialogActionsProps) {
  return <FluentDialogActions {...props} />;
}
