import type { ReactNode } from "react";
import { mergeClasses } from "@/components/ui";
import { useSharedStyles } from "@/styles/shared";
import type { StackGap } from "./Stack";
import { resolveLength, resolveSpacing } from "./spacing";

export function DetailSurface({
  children,
  className,
  p,
  mt,
  mb,
  minHeight,
}: {
  children: ReactNode;
  className?: string;
  p?: StackGap | (string & {}) | number;
  mt?: StackGap | (string & {}) | number;
  mb?: StackGap | (string & {}) | number;
  minHeight?: number | string;
}) {
  const sharedStyles = useSharedStyles();
  return (
    <div
      className={mergeClasses(sharedStyles.contentCard, className)}
      style={{
        ...(p !== undefined ? { padding: resolveSpacing(p) } : {}),
        ...(mt !== undefined ? { marginTop: resolveSpacing(mt) } : {}),
        ...(mb !== undefined ? { marginBottom: resolveSpacing(mb) } : {}),
        ...(minHeight !== undefined ? { minHeight: resolveLength(minHeight) } : {}),
      }}
    >
      {children}
    </div>
  );
}
