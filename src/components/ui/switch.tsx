import { Switch as FluentSwitch } from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentProps, ComponentRef } from "react";

export type SwitchProps = ComponentProps<typeof FluentSwitch>;

export const Switch = forwardRef<ComponentRef<typeof FluentSwitch>, SwitchProps>(
  function Switch(props, ref) {
    return <FluentSwitch ref={ref} {...props} />;
  },
);
