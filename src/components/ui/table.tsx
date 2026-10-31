import {
  Table as FluentTable,
  TableBody as FluentTableBody,
  TableCell as FluentTableCell,
  TableCellLayout as FluentTableCellLayout,
  TableHeader as FluentTableHeader,
  TableHeaderCell as FluentTableHeaderCell,
  TableRow as FluentTableRow,
} from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentRef, CSSProperties, MouseEvent, ReactNode } from "react";

export interface TableProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const Table = forwardRef<ComponentRef<typeof FluentTable>, TableProps>(
  function Table(props, ref) {
    return <FluentTable ref={ref} {...props} />;
  },
);

export interface TableHeaderProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const TableHeader = forwardRef<ComponentRef<typeof FluentTableHeader>, TableHeaderProps>(
  function TableHeader(props, ref) {
    return <FluentTableHeader ref={ref} {...props} />;
  },
);

export interface TableRowProps {
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  className?: string;
  style?: CSSProperties;
  title?: string;
  children?: ReactNode;
}

export const TableRow = forwardRef<ComponentRef<typeof FluentTableRow>, TableRowProps>(
  function TableRow(props, ref) {
    return <FluentTableRow ref={ref} {...props} />;
  },
);

export interface TableHeaderCellProps {
  sortDirection?: "ascending" | "descending";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const TableHeaderCell = forwardRef<
  ComponentRef<typeof FluentTableHeaderCell>,
  TableHeaderCellProps
>(function TableHeaderCell(props, ref) {
  return <FluentTableHeaderCell ref={ref} {...props} />;
});

export interface TableBodyProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const TableBody = forwardRef<ComponentRef<typeof FluentTableBody>, TableBodyProps>(
  function TableBody(props, ref) {
    return <FluentTableBody ref={ref} {...props} />;
  },
);

export interface TableCellProps {
  colSpan?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const TableCell = forwardRef<ComponentRef<typeof FluentTableCell>, TableCellProps>(
  function TableCell(props, ref) {
    return <FluentTableCell ref={ref} {...props} />;
  },
);

export interface TableCellLayoutProps {
  truncate?: boolean;
  title?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const TableCellLayout = forwardRef<
  ComponentRef<typeof FluentTableCellLayout>,
  TableCellLayoutProps
>(function TableCellLayout(props, ref) {
  return <FluentTableCellLayout ref={ref} {...props} />;
});
