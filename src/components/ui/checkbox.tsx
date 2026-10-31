import { Checkbox as FluentCheckbox } from "@fluentui/react-components";
import type { CSSProperties, MouseEvent } from "react";

export interface CheckboxProps {
  checked?: boolean | "mixed";
  defaultChecked?: boolean | "mixed";
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  onClick?: (e: MouseEvent<HTMLInputElement>) => void;
  className?: string;
  style?: CSSProperties;
  name?: string;
  id?: string;
  "aria-label"?: string;
}

export function Checkbox({ onChange, ...rest }: CheckboxProps) {
  return (
    <FluentCheckbox
      onChange={onChange ? (_, data) => onChange(data.checked === true) : undefined}
      {...rest}
    />
  );
}
