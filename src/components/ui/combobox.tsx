import { Combobox as FluentCombobox } from "@fluentui/react-components";
import type { CSSProperties, ReactNode } from "react";

export interface ComboboxProps {
  value?: string;
  selectedOptions?: string[];
  clearable?: boolean;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  onOptionSelect?: (value: string) => void;
  onTextChange?: (text: string) => void;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

export function Combobox({
  invalid,
  onOptionSelect,
  onTextChange,
  onOpenChange,
  style,
  children,
  ...rest
}: ComboboxProps) {
  return (
    <FluentCombobox
      onOptionSelect={
        onOptionSelect ? (_, data) => onOptionSelect(String(data.optionValue ?? "")) : undefined
      }
      onChange={
        onTextChange ? (event) => onTextChange((event.target as HTMLInputElement).value) : undefined
      }
      onOpenChange={onOpenChange ? (_, data) => onOpenChange(data.open) : undefined}
      style={invalid ? { ...style, borderColor: "#C50F1F" } : style}
      {...rest}
    >
      {children}
    </FluentCombobox>
  );
}
