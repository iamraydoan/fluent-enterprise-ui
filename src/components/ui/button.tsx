import { Button as FluentButton } from "@fluentui/react-components";
import { forwardRef } from "react";
import type { CSSProperties, MouseEvent, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "subtle" | "transparent" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: "before" | "after";
  shape?: "rounded" | "circular" | "square";
  type?: "button" | "submit" | "reset";
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  onMouseDown?: (e: MouseEvent<HTMLElement>) => void;
  className?: string;
  style?: CSSProperties;
  title?: string;
  autoFocus?: boolean;
  "aria-label"?: string;
  children?: ReactNode;
}

const SIZE_MAP: Record<ButtonSize, "small" | "medium" | "large"> = {
  sm: "small",
  md: "medium",
  lg: "large",
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ variant, size, ...rest }, ref) {
    return (
      <FluentButton
        ref={ref}
        appearance={variant}
        size={size ? SIZE_MAP[size] : undefined}
        {...(rest as object)}
      />
    );
  },
);
