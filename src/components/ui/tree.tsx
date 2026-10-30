import {
  Tree as FluentTree,
  TreeItem as FluentTreeItem,
  TreeItemLayout as FluentTreeItemLayout,
} from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentProps, ComponentRef } from "react";

export type TreeProps = ComponentProps<typeof FluentTree>;

export function Tree(props: TreeProps) {
  return <FluentTree {...props} />;
}

export type TreeItemProps = ComponentProps<typeof FluentTreeItem>;

export const TreeItem = forwardRef<ComponentRef<typeof FluentTreeItem>, TreeItemProps>(
  function TreeItem(props, ref) {
    return <FluentTreeItem ref={ref} {...props} />;
  },
);

export type TreeItemLayoutProps = ComponentProps<typeof FluentTreeItemLayout>;

export const TreeItemLayout = forwardRef<
  ComponentRef<typeof FluentTreeItemLayout>,
  TreeItemLayoutProps
>(function TreeItemLayout(props, ref) {
  return <FluentTreeItemLayout ref={ref} {...props} />;
});
