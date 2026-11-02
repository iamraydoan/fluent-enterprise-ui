import { Spinner as FluentSpinner } from "@fluentui/react-components";
import type { CSSProperties } from "react";

export type SpinnerSize = "tiny" | "small" | "medium" | "large" | "extra-large";

export interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

export function Spinner({ size = "medium", ...rest }: SpinnerProps) {
  return <FluentSpinner size={size} {...rest} />;
}
