import {
  Input as FluentInput,
  Textarea as FluentTextarea,
  Field as FluentField,
} from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentProps, ComponentRef } from "react";

export type InputProps = ComponentProps<typeof FluentInput>;

export const Input = forwardRef<ComponentRef<typeof FluentInput>, InputProps>(
  function Input(props, ref) {
    return <FluentInput ref={ref} {...props} />;
  },
);

export type TextareaProps = ComponentProps<typeof FluentTextarea>;

export const Textarea = forwardRef<ComponentRef<typeof FluentTextarea>, TextareaProps>(
  function Textarea(props, ref) {
    return <FluentTextarea ref={ref} {...props} />;
  },
);

export type FieldProps = ComponentProps<typeof FluentField>;

export const Field = forwardRef<ComponentRef<typeof FluentField>, FieldProps>(
  function Field(props, ref) {
    return <FluentField ref={ref} {...props} />;
  },
);
