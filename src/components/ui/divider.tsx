import { Divider as FluentDivider } from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentProps, ComponentRef } from "react";

export type DividerProps = ComponentProps<typeof FluentDivider>;

export const Divider = forwardRef<ComponentRef<typeof FluentDivider>, DividerProps>(
  function Divider(props, ref) {
    return <FluentDivider ref={ref} {...props} />;
  },
);
