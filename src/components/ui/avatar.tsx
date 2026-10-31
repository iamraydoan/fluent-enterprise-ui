import { Avatar as FluentAvatar } from "@fluentui/react-components";
import type { AvatarNamedColor } from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentRef, CSSProperties, ReactNode } from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | number;
export type AvatarShape = "circular" | "square";

export interface AvatarProps {
  name?: string;
  initials?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  color?: "neutral" | "brand" | "colorful" | AvatarNamedColor;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  children?: ReactNode;
}

const SIZE_MAP: Record<
  string,
  16 | 20 | 24 | 28 | 32 | 36 | 40 | 48 | 56 | 64 | 72 | 96 | 120 | 128
> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 72,
  xl: 96,
};

export const Avatar = forwardRef<ComponentRef<typeof FluentAvatar>, AvatarProps>(function Avatar(
  { size, ...rest },
  ref,
) {
  const resolvedSize = typeof size === "number" ? size : size ? SIZE_MAP[size] : undefined;
  return <FluentAvatar ref={ref} size={resolvedSize as 36} {...rest} />;
});
