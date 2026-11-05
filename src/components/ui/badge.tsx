import { Badge as FluentBadge } from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentRef, CSSProperties, ReactNode } from "react";
import { SIZE_MAP } from "./types";
import type { ComponentSize } from "./types";

export type BadgeVariant = "filled" | "outline" | "tint" | "ghost";
export type BadgeSize = ComponentSize;
export type BadgeShape = "circular" | "rounded" | "square";
export type BadgeColor =
  "brand" | "danger" | "important" | "informative" | "severe" | "subtle" | "success" | "warning";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  shape?: BadgeShape;
  color?: BadgeColor;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const Badge = forwardRef<ComponentRef<typeof FluentBadge>, BadgeProps>(function Badge(
  { variant, size, ...rest },
  ref,
) {
  return (
    <FluentBadge
      ref={ref}
      appearance={variant}
      size={size ? SIZE_MAP[size] : undefined}
      {...rest}
    />
  );
});
