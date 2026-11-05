import { Button as FluentButton } from "@fluentui/react-components";
import { forwardRef } from "react";
import type { CSSProperties, MouseEventHandler, ReactElement, ReactNode } from "react";
import { SIZE_MAP } from "./types";
import type { ComponentSize } from "./types";

export type ButtonVariant = "primary" | "secondary" | "subtle" | "transparent" | "outline";
export type ButtonSize = ComponentSize;

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  icon?: ReactElement | string | number | Iterable<ReactNode> | null;
  iconPosition?: "before" | "after";
  shape?: "rounded" | "circular" | "square";
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  onMouseDown?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  className?: string;
  style?: CSSProperties;
  title?: string;
  autoFocus?: boolean;
  "aria-label"?: string;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ variant, size, ...rest }, ref) {
    return (
      <FluentButton
        ref={ref}
        appearance={variant}
        size={size ? SIZE_MAP[size] : undefined}
        {...rest}
      />
    );
  },
);
