import {
  Body1Strong as FluentBody1Strong,
  Caption1 as FluentCaption1,
  Text as FluentText,
} from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentProps, ComponentRef } from "react";

export type TextProps = ComponentProps<typeof FluentText>;

export const Text = forwardRef<ComponentRef<typeof FluentText>, TextProps>(
  function Text(props, ref) {
    return <FluentText ref={ref} {...props} />;
  },
);

export type Body1StrongProps = ComponentProps<typeof FluentBody1Strong>;

export function Body1Strong(props: Body1StrongProps) {
  return <FluentBody1Strong {...props} />;
}

export type Caption1Props = ComponentProps<typeof FluentCaption1>;

export function Caption1(props: Caption1Props) {
  return <FluentCaption1 {...props} />;
}
