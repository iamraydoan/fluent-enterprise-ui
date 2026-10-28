import {
  Table as FluentTable,
  TableHeader as FluentTableHeader,
  TableRow as FluentTableRow,
  TableHeaderCell as FluentTableHeaderCell,
  TableBody as FluentTableBody,
  TableCell as FluentTableCell,
  TableCellLayout as FluentTableCellLayout,
} from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentProps, ComponentRef } from "react";

export type TableProps = ComponentProps<typeof FluentTable>;

export const Table = forwardRef<ComponentRef<typeof FluentTable>, TableProps>(
  function Table(props, ref) {
    return <FluentTable ref={ref} {...props} />;
  },
);

export type TableHeaderProps = ComponentProps<typeof FluentTableHeader>;

export const TableHeader = forwardRef<ComponentRef<typeof FluentTableHeader>, TableHeaderProps>(
  function TableHeader(props, ref) {
    return <FluentTableHeader ref={ref} {...props} />;
  },
);

export type TableRowProps = ComponentProps<typeof FluentTableRow>;

export const TableRow = forwardRef<ComponentRef<typeof FluentTableRow>, TableRowProps>(
  function TableRow(props, ref) {
    return <FluentTableRow ref={ref} {...props} />;
  },
);

export type TableHeaderCellProps = ComponentProps<typeof FluentTableHeaderCell>;

export const TableHeaderCell = forwardRef<
  ComponentRef<typeof FluentTableHeaderCell>,
  TableHeaderCellProps
>(function TableHeaderCell(props, ref) {
  return <FluentTableHeaderCell ref={ref} {...props} />;
});

export type TableBodyProps = ComponentProps<typeof FluentTableBody>;

export const TableBody = forwardRef<ComponentRef<typeof FluentTableBody>, TableBodyProps>(
  function TableBody(props, ref) {
    return <FluentTableBody ref={ref} {...props} />;
  },
);

export type TableCellProps = ComponentProps<typeof FluentTableCell>;

export const TableCell = forwardRef<ComponentRef<typeof FluentTableCell>, TableCellProps>(
  function TableCell(props, ref) {
    return <FluentTableCell ref={ref} {...props} />;
  },
);

export type TableCellLayoutProps = ComponentProps<typeof FluentTableCellLayout>;

export const TableCellLayout = forwardRef<
  ComponentRef<typeof FluentTableCellLayout>,
  TableCellLayoutProps
>(function TableCellLayout(props, ref) {
  return <FluentTableCellLayout ref={ref} {...props} />;
});
