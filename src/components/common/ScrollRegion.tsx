import type { CSSProperties, ReactNode } from "react";
import { mergeClasses } from "@/components/ui";
import type { StackGap } from "./Stack";
import { resolveSpacing } from "./spacing";

export interface ScrollRegionProps {
  axis?: "vertical" | "horizontal";
  grow?: boolean;
  p?: StackGap | (string & {}) | number;
  mt?: StackGap | (string & {}) | number;
  mb?: StackGap | (string & {}) | number;
  className?: string;
  children: ReactNode;
}

export function ScrollRegion({
  axis = "vertical",
  grow,
  p,
  mt,
  mb,
  className,
  children,
}: ScrollRegionProps) {
  const style: CSSProperties = {
    ...(axis === "vertical" ? { overflowY: "auto" } : { overflowX: "auto" }),
    ...(grow ? { flexGrow: 1, minWidth: 0, minHeight: 0 } : {}),
    ...(p !== undefined ? { padding: resolveSpacing(p) } : {}),
    ...(mt !== undefined ? { marginTop: resolveSpacing(mt) } : {}),
    ...(mb !== undefined ? { marginBottom: resolveSpacing(mb) } : {}),
  };
  return (
    <div className={mergeClasses(className)} style={style}>
      {children}
    </div>
  );
}
