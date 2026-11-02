import { Radio as FluentRadio, RadioGroup as FluentRadioGroup } from "@fluentui/react-components";
import type { CSSProperties, ReactNode } from "react";

export interface RadioProps {
  value: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Radio(props: RadioProps) {
  return <FluentRadio {...props} />;
}

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  children?: ReactNode;
}

export function RadioGroup({ onChange, ...rest }: RadioGroupProps) {
  return (
    <FluentRadioGroup
      onChange={onChange ? (_, data) => onChange(data.value) : undefined}
      {...rest}
    />
  );
}
