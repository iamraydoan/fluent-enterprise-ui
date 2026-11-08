import type { ReactNode } from "react";
import { mergeClasses } from "@/components/ui";
import { useSharedStyles } from "@/styles/shared";

export function DetailSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const sharedStyles = useSharedStyles();
  return <div className={mergeClasses(sharedStyles.contentCard, className)}>{children}</div>;
}
