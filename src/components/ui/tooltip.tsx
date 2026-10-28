import { Tooltip as FluentTooltip } from "@fluentui/react-components";
import type { ComponentProps } from "react";

export type TooltipProps = ComponentProps<typeof FluentTooltip>;

export function Tooltip(props: TooltipProps) {
  return <FluentTooltip {...props} />;
}
