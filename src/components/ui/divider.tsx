import { Divider as FluentDivider } from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentRef, CSSProperties } from "react";

export interface DividerProps {
  vertical?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const Divider = forwardRef<ComponentRef<typeof FluentDivider>, DividerProps>(
  function Divider(props, ref) {
    return <FluentDivider ref={ref} {...props} />;
  },
);
