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

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  gap?: StackGap | (string & {}) | number;
  align?: keyof typeof ALIGN_MAP | CSSProperties["alignItems"];
  justify?: keyof typeof JUSTIFY_MAP | CSSProperties["justifyContent"];
  wrap?: boolean;
  grow?: boolean;
  surface?: boolean;
  divider?: boolean;
  p?: StackGap | (string & {}) | number;
  mb?: StackGap | (string & {}) | number;
  minWidth?: number | string;
  minHeight?: number | string;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

function resolveSpacing(value: string | number): string {
  if (typeof value === "number") return `${value}px`;
  if (value === "none") return "0";
  return (theme.spacing as Record<string, string>)[value] ?? value;
}

function resolveLength(value: string | number): string {
  return typeof value === "number" ? value + "px" : value;
}

function stackStyle(direction: "row" | "column", props: StackProps): CSSProperties {
  const {
    gap = "md",
    align,
    justify,
    wrap,
    grow,
    surface,
    divider,
    p,
    mb,
    minWidth,
    minHeight,
  } = props;
  return {
    display: "flex",
    flexDirection: direction,
    gap: resolveSpacing(gap),
    ...(align !== undefined
      ? { alignItems: (ALIGN_MAP as Record<string, string>)[align] ?? align }
      : {}),
    ...(justify !== undefined
      ? { justifyContent: (JUSTIFY_MAP as Record<string, string>)[justify] ?? justify }
      : {}),
    ...(wrap ? { flexWrap: "wrap" } : {}),
    ...(grow ? { flexGrow: 1, minWidth: 0, minHeight: 0 } : {}),
    ...(surface ? cardSurface : {}),
    ...(divider ? { borderBottom: `1px solid ${theme.color.borderSubtle}` } : {}),
    ...(p !== undefined ? { padding: resolveSpacing(p) } : {}),
    ...(mb !== undefined ? { marginBottom: resolveSpacing(mb) } : {}),
    ...(minWidth !== undefined ? { minWidth: resolveLength(minWidth) } : {}),
    ...(minHeight !== undefined ? { minHeight: resolveLength(minHeight) } : {}),
  };
}

export function HStack(props: StackProps) {
  const { children, title, className, style, ...rest } = props;
  return (
    <div
      className={mergeClasses(className)}
      style={{ ...stackStyle("row", props), ...style }}
      title={title}
      {...rest}
    >
      {children}
    </div>
  );
}

export function VStack(props: StackProps) {
  const { children, title, className, style, ...rest } = props;
  return (
    <div
      className={mergeClasses(className)}
      style={{ ...stackStyle("column", props), ...style }}
      title={title}
      {...rest}
    >
      {children}
    </div>
  );
}

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  columns?:
    CSSProperties["gridTemplateColumns"] | "auto-fit" | "auto-fill" | "main-aside" | "aside-main";
  minColumn?: number;
  mainFr?: number;
  asideFr?: number;
  asideWidth?: number;
  gap?: StackGap | (string & {}) | number;
  align?: CSSProperties["alignItems"];
  grow?: boolean;
  p?: StackGap | (string & {}) | number;
  className?: string;
  style?: CSSProperties;
}

export function Grid({
  children,
  columns,
  minColumn = 300,
  mainFr = 3,
  asideFr = 2,
  asideWidth = 280,
  gap,
  align,
  grow,
  p,
  className,
  style,
  ...rest
}: GridProps) {
  const template =
    columns === "auto-fit"
      ? `repeat(auto-fit, minmax(${minColumn}px, 1fr))`
      : columns === "auto-fill"
        ? `repeat(auto-fill, minmax(${minColumn}px, 1fr))`
        : columns === "main-aside"
          ? `${mainFr}fr minmax(${asideWidth}px, 1fr)`
          : columns === "aside-main"
            ? `minmax(${asideWidth}px, ${asideFr}fr) ${mainFr}fr`
            : columns;
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: template,
        gap: gap === undefined ? undefined : resolveSpacing(gap),
        alignItems: align,
        flexGrow: grow ? 1 : undefined,
        minWidth: grow ? 0 : undefined,
        padding: p === undefined ? undefined : resolveSpacing(p),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
