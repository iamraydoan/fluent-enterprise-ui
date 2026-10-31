import {
  Tree as FluentTree,
  TreeItem as FluentTreeItem,
  TreeItemLayout as FluentTreeItemLayout,
} from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentRef, CSSProperties, MouseEvent, ReactElement, ReactNode } from "react";

export type TreeItemType = "branch" | "leaf";

export interface TreeProps {
  defaultOpenItems?: string[];
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  children?: ReactNode;
}

export function Tree(props: TreeProps) {
  return <FluentTree {...props} />;
}

export interface TreeItemProps {
  itemType: TreeItemType;
  value?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const TreeItem = forwardRef<ComponentRef<typeof FluentTreeItem>, TreeItemProps>(
  function TreeItem(props, ref) {
    return <FluentTreeItem ref={ref} {...props} />;
  },
);

export interface TreeItemLayoutProps {
  iconBefore?: ReactElement;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const TreeItemLayout = forwardRef<
  ComponentRef<typeof FluentTreeItemLayout>,
  TreeItemLayoutProps
>(function TreeItemLayout(props, ref) {
  return <FluentTreeItemLayout ref={ref} {...props} />;
});
