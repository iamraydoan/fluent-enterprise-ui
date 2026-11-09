import {
  Body1Strong as FluentBody1Strong,
  Caption1 as FluentCaption1,
  Text as FluentText,
} from "@fluentui/react-components";
import { forwardRef } from "react";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { makeStyles, mergeClasses, tokens } from "./styles";

const useToneStyles = makeStyles({
  primary: { color: tokens.colorNeutralForeground1 },
  secondary: { color: tokens.colorNeutralForeground2 },
  tertiary: { color: tokens.colorNeutralForeground3 },
});

export type TextSize = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000;
export type TextWeight = "regular" | "medium" | "semibold" | "bold";
export type TextTone = "primary" | "secondary" | "tertiary";
export type TextAlign = "start" | "center" | "end";

export interface TextProps {
  size?: TextSize;
  weight?: TextWeight;
  tone?: TextTone;
  align?: TextAlign;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  block?: boolean;
  truncate?: boolean;
  wrap?: boolean;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  className?: string;
  style?: CSSProperties;
  title?: string;
  children?: ReactNode;
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { tone, className, ...props },
  ref,
) {
  const toneStyles = useToneStyles();
  return (
    <FluentText
      ref={ref}
      className={mergeClasses(tone ? toneStyles[tone] : undefined, className)}
      {...props}
    />
  );
});

export function Body1Strong({ children, style }: { children?: ReactNode; style?: CSSProperties }) {
  return <FluentBody1Strong style={style}>{children}</FluentBody1Strong>;
}

export function Caption1({ children, style }: { children?: ReactNode; style?: CSSProperties }) {
  return <FluentCaption1 style={style}>{children}</FluentCaption1>;
}
