import {
  MessageBar as FluentMessageBar,
  MessageBarBody as FluentMessageBarBody,
} from "@fluentui/react-components";
import type { CSSProperties, ReactNode } from "react";

export type MessageBarIntent = "error" | "warning" | "success" | "info";

export interface MessageBarProps {
  intent?: MessageBarIntent;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function MessageBar({ intent = "info", ...rest }: MessageBarProps) {
  return <FluentMessageBar intent={intent} {...rest} />;
}

export interface MessageBarBodyProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function MessageBarBody(props: MessageBarBodyProps) {
  return <FluentMessageBarBody {...props} />;
}
