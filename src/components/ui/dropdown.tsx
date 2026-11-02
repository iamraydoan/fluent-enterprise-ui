import {
  Dropdown as FluentDropdown,
  Option as FluentOption,
} from "@fluentui/react-components";
import type { CSSProperties, ReactNode } from "react";

export interface DropdownProps {
  value?: string;
  selectedOptions?: string[];
  clearable?: boolean;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  buttonStyle?: CSSProperties;
  onOptionSelect?: (value: string) => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

export function Dropdown({
  invalid,
  buttonStyle,
  onOptionSelect,
  style,
  children,
  ...rest
}: DropdownProps) {
  return (
    <FluentDropdown
      onOptionSelect={
        onOptionSelect
          ? (_, data) => onOptionSelect(String(data.optionValue ?? ""))
          : undefined
      }
      button={buttonStyle ? { style: buttonStyle } : undefined}
      style={invalid ? { ...style, borderColor: "#C50F1F" } : style}
      {...rest}
    >
      {children}
    </FluentDropdown>
  );
}

export interface OptionProps {
  value: string;
  disabled?: boolean;
  text?: string;
  children?: ReactNode;
}

export function Option({ text, children, ...rest }: OptionProps) {
  const label = text ?? (typeof children === "string" ? children : "");
  return (
    <FluentOption text={label} {...rest}>
      {children}
    </FluentOption>
  );
}
