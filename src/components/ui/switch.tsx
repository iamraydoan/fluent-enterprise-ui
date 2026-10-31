import { Switch as FluentSwitch } from "@fluentui/react-components";
import type { CSSProperties } from "react";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  name?: string;
  id?: string;
}

export function Switch({ onChange, ...rest }: SwitchProps) {
  return (
    <FluentSwitch
      onChange={onChange ? (_, data) => onChange(data.checked === true) : undefined}
      {...rest}
    />
  );
}
