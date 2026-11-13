import { Tree, TreeItem, TreeItemLayout } from "@/components/ui";

interface FlowStructureTreeProps {
  name: string;
  items: { position: number; name: string }[];
}

export function FlowStructureTree({ name, items }: FlowStructureTreeProps) {
  return (
    <Tree>
      <TreeItem itemType="branch">
        <TreeItemLayout>{`${name} [A]`}</TreeItemLayout>
        {items.map((item) => (
          <TreeItem key={item.position} itemType="leaf">
            <TreeItemLayout>{`${item.position}. ${item.name}`}</TreeItemLayout>
          </TreeItem>
        ))}
      </TreeItem>
    </Tree>
  );
}
