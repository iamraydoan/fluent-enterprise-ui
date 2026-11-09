import type { ReactNode } from "react";
import { Table, TableCell, TableHeaderCell, makeStyles, mergeClasses } from "@/components/ui";
import { theme } from "@/styles/theme";

const useStyles = makeStyles({
  scroll: {
    overflow: "auto",
    border: `1px solid ${theme.color.borderSubtle}`,
    borderBottom: "none",
  },
  grow: { flexGrow: 1, minHeight: 0 },
  sticky: { "& th": { position: "sticky", top: 0, zIndex: 1 } },
  th: {
    backgroundColor: theme.color.surfaceTertiary,
    height: "36px",
    fontSize: "12px",
    fontWeight: 400,
    borderRight: `1px solid ${theme.color.borderSubtle}`,
    textTransform: "uppercase",
  },
  td: { height: "34.5px", fontSize: "13px" },
});

export interface DefinitionTableProps {
  ariaLabel: string;
  minWidth: number;
  stickyHeader?: boolean;
  grow?: boolean;
  children: ReactNode;
}

export function DefinitionTable({
  ariaLabel,
  minWidth,
  stickyHeader,
  grow,
  children,
}: DefinitionTableProps) {
  const styles = useStyles();
  return (
    <div
      className={mergeClasses(styles.scroll, grow && styles.grow, stickyHeader && styles.sticky)}
    >
      <Table aria-label={ariaLabel} style={{ tableLayout: "fixed", width: "100%", minWidth }}>
        {children}
      </Table>
    </div>
  );
}

export function DefinitionTableHeaderCell({
  width,
  children,
}: {
  width?: number | string;
  children?: ReactNode;
}) {
  const styles = useStyles();
  return (
    <TableHeaderCell className={styles.th} style={width === undefined ? undefined : { width }}>
      {children}
    </TableHeaderCell>
  );
}

export function DefinitionTableCell({ children }: { children?: ReactNode }) {
  const styles = useStyles();
  return <TableCell className={styles.td}>{children}</TableCell>;
}
