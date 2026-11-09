import type { CSSProperties, ReactNode } from "react";
import { mergeClasses } from "@/components/ui";
import { cardSurface } from "@/styles/shared";
import { theme } from "@/styles/theme";
import { resolveLength, resolveSpacing } from "./spacing";

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

const TONE_MAP = {
  surface: theme.color.surface,
  surfaceSecondary: theme.color.surfaceSecondary,
  surfaceTertiary: theme.color.surfaceTertiary,
  surfaceSelected: theme.color.surfaceSelected,
  brandSubtle: theme.color.brandSubtle,
  successTint: theme.color.successTint,
} as const;

export type SurfaceTone = keyof typeof TONE_MAP;

export type TextAlign = "start" | "center" | "end";

export type BorderSide = "top" | "right" | "bottom" | "left";

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  gap?: StackGap | (string & {}) | number;
  align?: keyof typeof ALIGN_MAP | CSSProperties["alignItems"];
  justify?: keyof typeof JUSTIFY_MAP | CSSProperties["justifyContent"];
  wrap?: boolean;
  inline?: boolean;
  grow?: boolean;
  shrink?: boolean;
  surface?: boolean;
  divider?: boolean;
  tone?: SurfaceTone;
  border?: boolean;
  borderSide?: BorderSide;
  borderOmit?: BorderSide;
  clip?: boolean;
  radius?: keyof typeof theme.radius;
  textAlign?: TextAlign;
  whiteSpace?: "pre-wrap";
  alignSelf?: keyof typeof ALIGN_MAP | CSSProperties["alignSelf"];
  p?: StackGap | (string & {}) | number;
  px?: StackGap | (string & {}) | number;
  py?: StackGap | (string & {}) | number;
  pt?: StackGap | (string & {}) | number;
  pb?: StackGap | (string & {}) | number;
  pl?: StackGap | (string & {}) | number;
  pr?: StackGap | (string & {}) | number;
  mb?: StackGap | (string & {}) | number;
  mt?: StackGap | (string & {}) | number;
  ml?: StackGap | (string & {}) | number;
  mr?: StackGap | (string & {}) | number;
  width?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

function stackStyle(direction: "row" | "column", props: StackProps): CSSProperties {
  const {
    gap = "md",
    align,
    justify,
    wrap,
    inline,
    grow,
    shrink,
    surface,
    divider,
    tone,
    border,
    borderSide,
    borderOmit,
    clip,
    radius,
    textAlign,
    whiteSpace,
    alignSelf,
    p,
    px,
    py,
    pt,
    pb,
    pl,
    pr,
    mb,
    mt,
    ml,
    mr,
    width,
    height,
    maxWidth,
    minWidth,
    minHeight,
  } = props;
  const borderValue = `${theme.borderWidth.thin} solid ${theme.color.borderSubtle}`;
  return {
    display: inline ? "inline-flex" : "flex",
    flexDirection: direction,
    gap: resolveSpacing(gap),
    ...(align !== undefined
      ? { alignItems: (ALIGN_MAP as Record<string, string>)[align] ?? align }
      : {}),
    ...(justify !== undefined
      ? { justifyContent: (JUSTIFY_MAP as Record<string, string>)[justify] ?? justify }
      : {}),
    ...(alignSelf !== undefined
      ? { alignSelf: (ALIGN_MAP as Record<string, string>)[alignSelf] ?? alignSelf }
      : {}),
    ...(wrap ? { flexWrap: "wrap" } : {}),
    ...(grow ? { flexGrow: 1, minWidth: 0, minHeight: 0 } : {}),
    ...(shrink ? { flexShrink: 0 } : {}),
    ...(surface ? cardSurface : {}),
    ...(tone !== undefined ? { backgroundColor: TONE_MAP[tone] } : {}),
    ...(border ? { border: borderValue } : {}),
    ...(borderSide === "top" ? { borderTop: borderValue } : {}),
    ...(borderSide === "right" ? { borderRight: borderValue } : {}),
    ...(borderSide === "bottom" ? { borderBottom: borderValue } : {}),
    ...(borderSide === "left" ? { borderLeft: borderValue } : {}),
    ...(borderOmit === "top" ? { borderTop: "none" } : {}),
    ...(borderOmit === "right" ? { borderRight: "none" } : {}),
    ...(borderOmit === "bottom" ? { borderBottom: "none" } : {}),
    ...(borderOmit === "left" ? { borderLeft: "none" } : {}),
    ...(clip ? { overflow: "hidden" } : {}),
    ...(radius !== undefined ? { borderRadius: theme.radius[radius] } : {}),
    ...(divider ? { borderBottom: `1px solid ${theme.color.borderSubtle}` } : {}),
    ...(textAlign !== undefined ? { textAlign } : {}),
    ...(whiteSpace !== undefined ? { whiteSpace } : {}),
    ...(p !== undefined ? { padding: resolveSpacing(p) } : {}),
    ...(px !== undefined
      ? { paddingLeft: resolveSpacing(px), paddingRight: resolveSpacing(px) }
      : {}),
    ...(py !== undefined
      ? { paddingTop: resolveSpacing(py), paddingBottom: resolveSpacing(py) }
      : {}),
    ...(pt !== undefined ? { paddingTop: resolveSpacing(pt) } : {}),
    ...(pb !== undefined ? { paddingBottom: resolveSpacing(pb) } : {}),
    ...(pl !== undefined ? { paddingLeft: resolveSpacing(pl) } : {}),
    ...(pr !== undefined ? { paddingRight: resolveSpacing(pr) } : {}),
    ...(mt !== undefined ? { marginTop: resolveSpacing(mt) } : {}),
    ...(mb !== undefined ? { marginBottom: resolveSpacing(mb) } : {}),
    ...(ml !== undefined ? { marginLeft: resolveSpacing(ml) } : {}),
    ...(mr !== undefined ? { marginRight: resolveSpacing(mr) } : {}),
    ...(width !== undefined ? { width: resolveLength(width) } : {}),
    ...(height !== undefined ? { height: resolveLength(height) } : {}),
    ...(maxWidth !== undefined ? { maxWidth: resolveLength(maxWidth) } : {}),
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
