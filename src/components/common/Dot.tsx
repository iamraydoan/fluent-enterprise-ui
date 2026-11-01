import type { CSSProperties } from "react";
import { mergeClasses } from "@/components/ui";
import { theme } from "@/styles/theme";

interface DotProps {
  color?: string;
  size?: number;
  ariaLabel?: string;
  className?: string;
}

export function Dot({ color = theme.color.brand, size = 16, ariaLabel, className }: DotProps) {
  const style: CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    backgroundColor: color,
    flexShrink: 0,
    display: "inline-block",
  };
  return <span className={mergeClasses(className)} style={style} aria-label={ariaLabel} />;
}
