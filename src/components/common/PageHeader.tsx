import type { ReactNode } from "react";
import { Button, ChevronDown20Regular, ChevronUp20Regular } from "@/components/ui";
import { useSharedStyles } from "@/styles/shared";

interface PageHeaderProps {
  children: ReactNode;
  collapsed: boolean;
  onToggle: () => void;
}

export function PageHeader({ children, collapsed, onToggle }: PageHeaderProps) {
  const sharedStyles = useSharedStyles();
  return (
    <div className={sharedStyles.pageHeader} style={collapsed ? { borderTop: "none" } : undefined}>
      {children}
      <Button
        appearance="subtle"
        size="small"
        icon={collapsed ? <ChevronDown20Regular /> : <ChevronUp20Regular />}
        aria-label={collapsed ? "Expand action bar" : "Collapse action bar"}
        title={collapsed ? "Expand action bar" : "Collapse action bar"}
        onClick={onToggle}
      />
    </div>
  );
}
