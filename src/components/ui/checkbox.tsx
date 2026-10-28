import { Checkbox as FluentCheckbox } from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentProps, ComponentRef } from "react";

export type CheckboxProps = ComponentProps<typeof FluentCheckbox>;

export const Checkbox = forwardRef<ComponentRef<typeof FluentCheckbox>, CheckboxProps>(
  function Checkbox(props, ref) {
    return <FluentCheckbox ref={ref} {...props} />;
  },
);
