import { useMemo } from "react";
import { Wrench20Regular } from "@/components/icons";
import { Tree, TreeItem, TreeItemLayout, makeStyles, mergeClasses, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { buildTree, entryName } from "./data";
import type { TreeNode } from "./data";

const useTreeStyles = makeStyles({
  item: {
    borderRadius: tokens.borderRadiusMedium,
  },
  selected: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    fontWeight: tokens.fontWeightSemibold,
  },
  layout: {
    minHeight: "36px",
  },
});

function BranchNodes({
  nodes,
  selectedPath,
  onSelect,
}: {
  nodes: TreeNode[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
}) {
  const styles = useTreeStyles();
  return (
    <>
      {nodes.map((node) => (
        <TreeItem key={node.path} itemType="branch" value={node.path}>
          <TreeItemLayout
            iconBefore={<Wrench20Regular />}
            className={mergeClasses(styles.item, selectedPath === node.path && styles.selected)}
            onClick={() => onSelect(node.path)}
          >
            {entryName(node.path)}
          </TreeItemLayout>
          {node.children.length > 0 && (
            <Tree aria-label={entryName(node.path)}>
              <BranchNodes nodes={node.children} selectedPath={selectedPath} onSelect={onSelect} />
            </Tree>
          )}
        </TreeItem>
      ))}
    </>
  );
}

interface ConfigurationTreeProps {
  branchPaths: string[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
}

export function ConfigurationTree({ branchPaths, selectedPath, onSelect }: ConfigurationTreeProps) {
  const { t } = useAppTranslation();
  const nodes = useMemo(() => buildTree(branchPaths), [branchPaths]);
  const defaultOpen = useMemo(() => ["/", ...nodes.map((node) => node.path)], [nodes]);
  if (nodes.length === 0) return null;
  return (
    <Tree aria-label={t("configuration.tree.title")} defaultOpenItems={defaultOpen}>
      <TreeItem itemType="branch" value="/">
        <TreeItemLayout iconBefore={<Wrench20Regular />}>{entryName("/")}</TreeItemLayout>
        <Tree aria-label={entryName("/")}>
          <BranchNodes nodes={nodes} selectedPath={selectedPath} onSelect={onSelect} />
        </Tree>
      </TreeItem>
    </Tree>
  );
}
