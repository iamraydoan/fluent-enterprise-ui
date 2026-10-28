import { Button as FluentButton } from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentProps, ComponentRef } from "react";

export type ButtonProps = ComponentProps<typeof FluentButton>;

export const Button = forwardRef<ComponentRef<typeof FluentButton>, ButtonProps>(
  function Button(props, ref) {
    return <FluentButton ref={ref} {...props} />;
  },
);
