import { useState } from "react";
import type { ReactElement } from "react";
import { ActionBar } from "@/components/common/ActionBar";
import { PageHeader } from "@/components/common/PageHeader";
import { RibbonButton } from "@/components/common/RibbonButton";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

interface RibbonAction {
  icon: ReactElement;
  label: string;
}

interface ListPageHeaderProps {
  icon: ReactElement;
  title: string;
  actions: RibbonAction[];
}

export function ListPageHeader({ icon, title, actions }: ListPageHeaderProps) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={sharedStyles.headerBlock}>
      {!collapsed && (
        <ActionBar>
          <div className={sharedStyles.actionBarGroup}>
            <div className={sharedStyles.actionBarGroupButtons}>
              {actions.map((action) => (
                <RibbonButton
                  key={action.label}
                  sharedStyles={sharedStyles}
                  icon={action.icon}
                  label={action.label}
                />
              ))}
            </div>
            <div className={sharedStyles.actionBarGroupLabel}>{t("actionBar.groups.general")}</div>
          </div>
        </ActionBar>
      )}
      <PageHeader collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)}>
        <span style={{ display: "inline-flex", alignItems: "center", columnGap: 12 }}>
          {icon}
          <Text size={300}>{title}</Text>
        </span>
      </PageHeader>
    </div>
  );
}
