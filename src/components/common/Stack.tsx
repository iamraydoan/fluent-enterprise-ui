import type { CSSProperties, ReactNode } from "react";
import { mergeClasses } from "@/components/ui";
import { cardSurface } from "@/styles/shared";
import { theme } from "@/styles/theme";

export type StackGap = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const ALIGN_MAP = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
} as const;

const JUSTIFY_MAP = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
} as const;

interface StackProps {
  children: ReactNode;
  gap?: StackGap | (string & {});
  align?: keyof typeof ALIGN_MAP;
  justify?: keyof typeof JUSTIFY_MAP;
  wrap?: boolean;
  grow?: boolean;
  surface?: boolean;
  divider?: boolean;
  p?: StackGap | (string & {});
  title?: string;
  className?: string;
}

function resolveSpacing(value: string): string {
  if (value === "none") return "0";
  return (theme.spacing as Record<string, string>)[value] ?? value;
}

function stackStyle(direction: "row" | "column", props: StackProps): CSSProperties {
  const { gap = "md", align, justify, wrap, grow, surface, divider, p } = props;
  return {
    display: "flex",
    flexDirection: direction,
    gap: resolveSpacing(gap),
    ...(align !== undefined ? { alignItems: ALIGN_MAP[align] } : {}),
    ...(justify !== undefined ? { justifyContent: JUSTIFY_MAP[justify] } : {}),
    ...(wrap ? { flexWrap: "wrap" } : {}),
    ...(grow ? { flexGrow: 1, minWidth: 0, minHeight: 0 } : {}),
    ...(surface ? cardSurface : {}),
    ...(divider ? { borderBottom: `1px solid ${theme.color.borderSubtle}` } : {}),
    ...(p !== undefined ? { padding: resolveSpacing(p) } : {}),
  };
}

export function HStack(props: StackProps) {
  const { children, title, className } = props;
  return (
    <div className={mergeClasses(className)} style={stackStyle("row", props)} title={title}>
      {children}
    </div>
  );
}

export function VStack(props: StackProps) {
  const { children, title, className } = props;
  return (
    <div className={mergeClasses(className)} style={stackStyle("column", props)} title={title}>
      {children}
    </div>
  );
}
