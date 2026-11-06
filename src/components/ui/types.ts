export type ComponentSize = "sm" | "md" | "lg";

type FluentSize = "small" | "medium" | "large";

export const SIZE_MAP: Record<ComponentSize, FluentSize> = {
  sm: "small",
  md: "medium",
  lg: "large",
};
