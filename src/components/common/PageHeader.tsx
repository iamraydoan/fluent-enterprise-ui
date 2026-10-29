import type { ReactNode } from "react";
import { ChevronDown20Regular, ChevronUp20Regular } from "@/components/icons";
import { Button } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

interface PageHeaderProps {
  children: ReactNode;
  collapsed: boolean;
  onToggle: () => void;
}

export function PageHeader({ children, collapsed, onToggle }: PageHeaderProps) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  return (
    <div className={sharedStyles.pageHeader} style={collapsed ? { borderTop: "none" } : undefined}>
      {children}
      <Button
        appearance="subtle"
        size="small"
        icon={collapsed ? <ChevronDown20Regular /> : <ChevronUp20Regular />}
        aria-label={collapsed ? t("pageHeader.expandActionBar") : t("pageHeader.collapseActionBar")}
        title={collapsed ? t("pageHeader.expandActionBar") : t("pageHeader.collapseActionBar")}
        onClick={onToggle}
      />
    </div>
  );
}
