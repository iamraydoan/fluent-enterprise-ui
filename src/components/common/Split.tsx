import type { ReactNode } from "react";
import { HStack, VStack } from "./Stack";
import type { StackGap } from "./Stack";
import { makeStyles, mergeClasses } from "@/components/ui";
import { theme } from "@/styles/theme";

const useSplitStyles = makeStyles({
  root: { flexGrow: 1, minHeight: 0 },
  sidebar: { flexShrink: 0, minHeight: 0 },
  main: { flexGrow: 1, minWidth: 0, minHeight: 0 },
});

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
  const styles = useSplitStyles();
  const gapValue = resolveGap(gap);
  return (
    <HStack gap={gapValue} className={mergeClasses(styles.root, className)}>
      <VStack className={styles.sidebar} style={{ width: sidebarWidth }}>
        {sidebar}
      </VStack>
      <VStack grow gap={gapValue} className={styles.main}>
        {children}
      </VStack>
    </HStack>
  );
}
