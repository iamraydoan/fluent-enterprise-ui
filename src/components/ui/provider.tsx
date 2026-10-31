import { FluentProvider as FluentFluentProvider, type Theme } from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentRef, CSSProperties, ReactNode } from "react";

export interface FluentProviderProps {
  theme?: Theme;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const FluentProvider = forwardRef<
  ComponentRef<typeof FluentFluentProvider>,
  FluentProviderProps
>(function FluentProvider(props, ref) {
  return <FluentFluentProvider ref={ref} {...props} />;
});
