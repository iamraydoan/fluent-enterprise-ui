import type { CSSProperties, ReactNode } from "react";
import { mergeClasses } from "@/components/ui";
import { theme } from "@/styles/theme";
import type { StackGap } from "./Stack";

interface SplitProps {
  sidebar: ReactNode;
  children: ReactNode;
  sidebarWidth?: string;
  gap?: StackGap | (string & {});
  className?: string;
}

function resolveGap(gap: string): string {
  if (gap === "none") return "0";
  return (theme.spacing as Record<string, string>)[gap] ?? gap;
}

export function Split({ sidebar, children, sidebarWidth = "300px", gap = "md", className }: SplitProps) {
  const gapValue = resolveGap(gap);
  const rootStyle: CSSProperties = {
    display: "flex",
    columnGap: gapValue,
    flexGrow: 1,
    minHeight: 0,
  };
  const sideStyle: CSSProperties = {
    width: sidebarWidth,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  };
  const mainStyle: CSSProperties = {
    flexGrow: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    rowGap: gapValue,
    minHeight: 0,
  };
  return (
    <div className={mergeClasses(className)} style={rootStyle}>
      <div style={sideStyle}>{sidebar}</div>
      <div style={mainStyle}>{children}</div>
    </div>
  );
}
