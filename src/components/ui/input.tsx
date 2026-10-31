import {
  Input as FluentInput,
  Textarea as FluentTextarea,
  Field as FluentField,
} from "@fluentui/react-components";
import { forwardRef } from "react";
import type {
  ComponentProps,
  ComponentRef,
  CSSProperties,
  KeyboardEvent,
  ReactElement,
} from "react";

export type InputType =
  "text" | "password" | "number" | "date" | "datetime-local" | "email" | "search" | "tel" | "url";

export type InputVariant = "outline" | "underline" | "filled";
export type InputSize = "sm" | "md" | "lg";

export interface InputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  type?: InputType;
  variant?: InputVariant;
  size?: InputSize;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  contentBefore?: ReactElement;
  contentAfter?: ReactElement;
  className?: string;
  style?: CSSProperties;
  autoFocus?: boolean;
  maxLength?: number;
  name?: string;
  id?: string;
  "aria-label"?: string;
}

const INPUT_VARIANT_MAP: Record<InputVariant, "outline" | "underline" | "filled-darker"> = {
  outline: "outline",
  underline: "underline",
  filled: "filled-darker",
};

const INPUT_SIZE_MAP: Record<InputSize, "small" | "medium" | "large"> = {
  sm: "small",
  md: "medium",
  lg: "large",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { onChange, variant, size, ...rest },
  ref,
) {
  return (
    <FluentInput
      ref={ref}
      onChange={onChange ? (_, data) => onChange(data.value) : undefined}
      appearance={variant ? INPUT_VARIANT_MAP[variant] : undefined}
      size={size ? INPUT_SIZE_MAP[size] : undefined}
      {...rest}
    />
  );
});

export interface TextareaProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  rows?: number;
  className?: string;
  style?: CSSProperties;
  autoFocus?: boolean;
  maxLength?: number;
  name?: string;
  id?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { onChange, ...rest },
  ref,
) {
  return (
    <FluentTextarea
      ref={ref}
      onChange={onChange ? (_, data) => onChange(data.value) : undefined}
      {...rest}
    />
  );
});

export type FieldProps = ComponentProps<typeof FluentField>;

export const Field = forwardRef<ComponentRef<typeof FluentField>, FieldProps>(
  function Field(props, ref) {
    return <FluentField ref={ref} {...props} />;
  },
);
