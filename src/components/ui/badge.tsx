import { Badge as FluentBadge } from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentProps, ComponentRef } from "react";

export type BadgeProps = ComponentProps<typeof FluentBadge>;

export const Badge = forwardRef<ComponentRef<typeof FluentBadge>, BadgeProps>(
  function Badge(props, ref) {
    return <FluentBadge ref={ref} {...props} />;
  },
);
