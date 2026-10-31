import { Tooltip as FluentTooltip } from "@fluentui/react-components";
import type { CSSProperties, ReactElement } from "react";

export type TooltipRelationship = "label" | "description" | "inaccessible";
export type TooltipPositioning = "above" | "below" | "before" | "after";

export interface TooltipProps {
  content: ReactElement | string;
  relationship: TooltipRelationship;
  positioning?: TooltipPositioning;
  visible?: boolean;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  children: ReactElement;
}

export function Tooltip({ children, ...rest }: TooltipProps) {
  return <FluentTooltip {...rest}>{children}</FluentTooltip>;
}
