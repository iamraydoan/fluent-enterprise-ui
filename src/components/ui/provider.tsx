import { FluentProvider as FluentFluentProvider } from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentProps, ComponentRef } from "react";

export type FluentProviderProps = ComponentProps<typeof FluentFluentProvider>;

export const FluentProvider = forwardRef<
  ComponentRef<typeof FluentFluentProvider>,
  FluentProviderProps
>(function FluentProvider(props, ref) {
  return <FluentFluentProvider ref={ref} {...props} />;
});
