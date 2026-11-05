import type { ReactNode } from "react";
import { makeStyles, mergeClasses } from "@/components/ui";
import { theme } from "@/styles/theme";

const useFilterBarStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    columnGap: "16px",
    rowGap: "8px",
    flexWrap: "wrap",
  },
  justifyEnd: { justifyContent: "flex-end", columnGap: "12px" },
  divider: {
    paddingBottom: "12px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  group: { display: "flex", alignItems: "center", columnGap: "8px" },
  alignEnd: { marginLeft: "auto" },
  label: {
    fontSize: "12px",
    color: theme.color.textTertiary,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
  },
});

interface FilterBarProps {
  children: ReactNode;
  justifyEnd?: boolean;
  divider?: boolean;
  className?: string;
}

export function FilterBar({ children, justifyEnd, divider, className }: FilterBarProps) {
  const styles = useFilterBarStyles();
  return (
    <div
      className={mergeClasses(
        styles.root,
        justifyEnd && styles.justifyEnd,
        divider && styles.divider,
        className,
      )}
      role="search"
    >
      {children}
    </div>
  );
}

interface FilterGroupProps {
  children: ReactNode;
  label?: string;
  alignEnd?: boolean;
  className?: string;
}

export function FilterGroup({ children, label, alignEnd, className }: FilterGroupProps) {
  const styles = useFilterBarStyles();
  return (
    <span className={mergeClasses(styles.group, alignEnd && styles.alignEnd, className)}>
      {label !== undefined && <span className={styles.label}>{label}:</span>}
      {children}
    </span>
  );
}
