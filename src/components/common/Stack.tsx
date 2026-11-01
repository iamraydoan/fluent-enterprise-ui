import type { CSSProperties, ReactNode } from "react";
import { makeStyles, mergeClasses } from "@/components/ui";

const useStackStyles = makeStyles({
  hstack: { display: "flex", flexDirection: "row", alignItems: "center" },
  vstack: { display: "flex", flexDirection: "column", alignItems: "stretch" },
  grow: { flexGrow: 1, minWidth: 0, minHeight: 0 },
  wrap: { flexWrap: "wrap" },
});

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  gap?: CSSProperties["gap"];
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  wrap?: boolean;
  grow?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function HStack({
  children,
  gap,
  align,
  justify,
  wrap,
  grow,
  className,
  style,
  ...rest
}: StackProps) {
  const styles = useStackStyles();
  return (
    <div
      className={mergeClasses(styles.hstack, wrap && styles.wrap, grow && styles.grow, className)}
      style={{ columnGap: gap, rowGap: gap, alignItems: align, justifyContent: justify, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function VStack({
  children,
  gap,
  align,
  justify,
  wrap,
  grow,
  className,
  style,
  ...rest
}: StackProps) {
  const styles = useStackStyles();
  return (
    <div
      className={mergeClasses(styles.vstack, wrap && styles.wrap, grow && styles.grow, className)}
      style={{ rowGap: gap, columnGap: gap, alignItems: align, justifyContent: justify, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  columns?: CSSProperties["gridTemplateColumns"];
  gap?: CSSProperties["gap"];
  align?: CSSProperties["alignItems"];
  grow?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Grid({ children, columns, gap, align, grow, className, style, ...rest }: GridProps) {
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: columns,
        gap,
        alignItems: align,
        flexGrow: grow ? 1 : undefined,
        minWidth: grow ? 0 : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
