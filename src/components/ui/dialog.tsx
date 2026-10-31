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
import type { ComponentRef, CSSProperties, ReactElement, ReactNode } from "react";

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export function Dialog({ onOpenChange, children, ...rest }: DialogProps) {
  return (
    <FluentDialog
      onOpenChange={onOpenChange ? (_, data) => onOpenChange(data.open) : undefined}
      {...rest}
    >
      {children as ReactElement}
    </FluentDialog>
  );
}

export interface DialogTriggerProps {
  disableButtonEnhancement?: boolean;
  children?: ReactNode;
}

export function DialogTrigger({ children, ...rest }: DialogTriggerProps) {
  return <FluentDialogTrigger {...rest}>{children as ReactElement}</FluentDialogTrigger>;
}

export interface DialogSurfaceProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const DialogSurface = forwardRef<
  ComponentRef<typeof FluentDialogSurface>,
  DialogSurfaceProps
>(function DialogSurface(props, ref) {
  return <FluentDialogSurface ref={ref} {...props} />;
});

export interface DialogBodyProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const DialogBody = forwardRef<ComponentRef<typeof FluentDialogBody>, DialogBodyProps>(
  function DialogBody(props, ref) {
    return <FluentDialogBody ref={ref} {...props} />;
  },
);

export interface DialogTitleProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function DialogTitle(props: DialogTitleProps) {
  return <FluentDialogTitle {...props} />;
}

export interface DialogContentProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function DialogContent(props: DialogContentProps) {
  return <FluentDialogContent {...props} />;
}

export interface DialogActionsProps {
  position?: "start" | "end";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function DialogActions(props: DialogActionsProps) {
  return <FluentDialogActions {...props} />;
}
